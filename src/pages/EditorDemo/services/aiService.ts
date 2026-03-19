import { GoogleGenAI, Type } from '@google/genai';
import { Point, Attachment, Furniture } from '../store';
import { FURNITURE_CATALOG } from '../components/Sidebar';
import { v4 as uuidv4 } from 'uuid';
import { getFurnitureDimensions } from '../store';

// Helper to check if a point is inside the room polygon
const isPointInPolygon = (px: number, pz: number, vertices: Point[]) => {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, zi = vertices[i].z;
    const xj = vertices[j].x, zj = vertices[j].z;
    const intersect = ((zi > pz) !== (zj > pz))
        && (px < (xj - xi) * (pz - zi) / (zj - zi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

// Basic Constraint Solver
const applyConstraints = (
  furnitureList: Furniture[], 
  vertices: Point[], 
  doors: any[]
): Furniture[] => {
  const resolved = [...furnitureList];

  // 1. Wall Snapping for specific items
  const wallHuggingItems = ['procedural:bed', 'procedural:wardrobe', 'procedural:tvstand', 'procedural:bookshelf'];
  
  resolved.forEach(item => {
    if (wallHuggingItems.includes(item.modelUrl)) {
      let minDist = Infinity;
      let bestPoint = { x: item.position[0], z: item.position[2] };
      let bestAngle = item.rotation[1];

      for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        const dx = p2.x - p1.x;
        const dz = p2.z - p1.z;
        const len = Math.sqrt(dx*dx + dz*dz);
        if (len === 0) continue;

        let t = ((item.position[0] - p1.x) * dx + (item.position[2] - p1.z) * dz) / (len * len);
        t = Math.max(0.1, Math.min(0.9, t)); // Keep away from exact corners
        
        const projX = p1.x + t * dx;
        const projZ = p1.z + t * dz;
        const dist = Math.sqrt((item.position[0] - projX) ** 2 + (item.position[2] - projZ) ** 2);

        if (dist < minDist) {
          minDist = dist;
          // Calculate normal pointing inwards
          const angle = Math.atan2(dz, dx);
          const nx = -Math.sin(angle);
          const nz = Math.cos(angle);
          
          const dims = getFurnitureDimensions(item.modelUrl);
          // Move item half its depth away from the wall along the normal
          bestPoint = { 
            x: projX + nx * (dims.depth / 2), 
            z: projZ + nz * (dims.depth / 2) 
          };
          // Rotate to face away from the wall
          bestAngle = angle;
        }
      }
      
      item.position = [bestPoint.x, 0, bestPoint.z];
      item.rotation = [0, bestAngle, 0];
    }
  });

  // 2. Table-Chair Snapping
  const tables = resolved.filter(f => f.modelUrl === 'procedural:table' || f.modelUrl === 'procedural:desk');
  const chairs = resolved.filter(f => f.modelUrl === 'procedural:chair');

  chairs.forEach(chair => {
    let closestTable = null;
    let minDist = Infinity;

    tables.forEach(table => {
      const dist = Math.sqrt((chair.position[0] - table.position[0])**2 + (chair.position[2] - table.position[2])**2);
      if (dist < minDist) {
        minDist = dist;
        closestTable = table;
      }
    });

    // If a chair is near a table (within 1.5m), snap it to the table's edge
    if (closestTable && minDist < 1.5) {
      const tDims = getFurnitureDimensions(closestTable.modelUrl);
      const cDims = getFurnitureDimensions(chair.modelUrl);
      
      const dx = chair.position[0] - closestTable.position[0];
      const dz = chair.position[2] - closestTable.position[2];
      
      const sAngle = closestTable.rotation[1];
      const sCos = Math.cos(-sAngle);
      const sSin = Math.sin(-sAngle);
      const localDx = dx * sCos - dz * sSin;
      const localDz = dx * sSin + dz * sCos;
      
      const hw = tDims.width / 2;
      const hd = tDims.depth / 2;
      const shw = cDims.width / 2;
      const shd = cDims.depth / 2;
      
      const distPosX = Math.abs(localDx - (hw + shd));
      const distNegX = Math.abs(localDx - -(hw + shd));
      const distPosZ = Math.abs(localDz - (hd + shd));
      const distNegZ = Math.abs(localDz - -(hd + shd));
      
      const minFaceDist = Math.min(distPosX, distNegX, distPosZ, distNegZ);
      
      let snapLocalX = 0;
      let snapLocalZ = 0;
      let snapRotation = 0;
      
      if (minFaceDist === distPosX) {
        snapLocalX = hw + shd;
        snapLocalZ = Math.max(-hd, Math.min(hd, localDz));
      } else if (minFaceDist === distNegX) {
        snapLocalX = -(hw + shd);
        snapLocalZ = Math.max(-hd, Math.min(hd, localDz));
      } else if (minFaceDist === distPosZ) {
        snapLocalX = Math.max(-hw, Math.min(hw, localDx));
        snapLocalZ = hd + shd;
      } else {
        snapLocalX = Math.max(-hw, Math.min(hw, localDx));
        snapLocalZ = -(hd + shd);
      }
      
      const wCos = Math.cos(sAngle);
      const wSin = Math.sin(sAngle);
      chair.position[0] = closestTable.position[0] + snapLocalX * wCos - snapLocalZ * wSin;
      chair.position[2] = closestTable.position[2] + snapLocalX * wSin + snapLocalZ * wCos;
      
      // Calculate rotation to face the table's center
      const faceDx = closestTable.position[0] - chair.position[0];
      const faceDz = closestTable.position[2] - chair.position[2];
      chair.rotation[1] = Math.atan2(faceDx, faceDz);
    }
  });

  // 3. Pathfinding & Door Clearance
  // Create a clear path from each door to the center of the room
  let centerX = 0, centerZ = 0;
  vertices.forEach(v => { centerX += v.x; centerZ += v.z; });
  if (vertices.length > 0) {
    centerX /= vertices.length;
    centerZ /= vertices.length;
  }

  const PATH_WIDTH = 1.0; // 1 meter walking path

  doors.forEach(door => {
    const startX = door.position[0];
    const startZ = door.position[2];
    const endX = centerX;
    const endZ = centerZ;

    const pathDx = endX - startX;
    const pathDz = endZ - startZ;
    const pathLenSq = pathDx * pathDx + pathDz * pathDz;

    resolved.forEach(item => {
      if (item.modelUrl === 'procedural:rug') return; // Rugs don't block paths

      const dims = getFurnitureDimensions(item.modelUrl);
      const itemRadius = Math.max(dims.width, dims.depth) / 2;
      const requiredClearance = (PATH_WIDTH / 2) + itemRadius;

      // Find closest point on path segment to furniture
      let t = 0;
      if (pathLenSq > 0) {
        t = ((item.position[0] - startX) * pathDx + (item.position[2] - startZ) * pathDz) / pathLenSq;
        t = Math.max(0, Math.min(1, t));
      }

      const projX = startX + t * pathDx;
      const projZ = startZ + t * pathDz;

      const distSq = (item.position[0] - projX) ** 2 + (item.position[2] - projZ) ** 2;
      const dist = Math.sqrt(distSq);

      if (dist < requiredClearance) {
        // Furniture is blocking the path! Push it away.
        let pushX = item.position[0] - projX;
        let pushZ = item.position[2] - projZ;
        
        if (dist === 0.0) {
          pushX = -pathDz;
          pushZ = pathDx;
        }

        const pushLen = Math.sqrt(pushX * pushX + pushZ * pushZ);
        if (pushLen > 0) {
          pushX /= pushLen;
          pushZ /= pushLen;
          const pushAmount = requiredClearance - dist;
          item.position[0] += pushX * pushAmount;
          item.position[2] += pushZ * pushAmount;
        }
      }
    });
  });

  // 4. Furniture Collision Resolution (Separation)
  // Prevent items from overlapping each other
  const isTableChairPair = (a: string, b: string) => {
    const isAChair = a === 'procedural:chair';
    const isBChair = b === 'procedural:chair';
    const isATable = a === 'procedural:table' || a === 'procedural:desk';
    const isBTable = b === 'procedural:table' || b === 'procedural:desk';
    return (isAChair && isBTable) || (isBChair && isATable);
  };

  for (let iter = 0; iter < 3; iter++) {
    for (let i = 0; i < resolved.length; i++) {
      for (let j = i + 1; j < resolved.length; j++) {
        const itemA = resolved[i];
        const itemB = resolved[j];
        
        if (itemA.modelUrl === 'procedural:rug' || itemB.modelUrl === 'procedural:rug') continue; // Rugs don't collide
        if (isTableChairPair(itemA.modelUrl, itemB.modelUrl)) continue;

        const dimsA = getFurnitureDimensions(itemA.modelUrl);
        const dimsB = getFurnitureDimensions(itemB.modelUrl);
        
        // Use a slightly smaller radius for collision to allow tight packing
        const radiusA = Math.min(dimsA.width, dimsA.depth) / 2;
        const radiusB = Math.min(dimsB.width, dimsB.depth) / 2;
        const minSafeDist = radiusA + radiusB + 0.2;

        const dx = itemA.position[0] - itemB.position[0];
        const dz = itemA.position[2] - itemB.position[2];
        const dist = Math.sqrt(dx*dx + dz*dz);

        if (dist < minSafeDist && dist > 0) {
          const overlap = minSafeDist - dist;
          const pushX = (dx / dist) * (overlap / 2);
          const pushZ = (dz / dist) * (overlap / 2);

          itemA.position[0] += pushX;
          itemA.position[2] += pushZ;
          itemB.position[0] -= pushX;
          itemB.position[2] -= pushZ;
        }
      }
    }
  }

  // 5. Boundary Enforcement (Push items back inside if they escaped)
  resolved.forEach(item => {
    if (!isPointInPolygon(item.position[0], item.position[2], vertices)) {
      // Find closest point on boundary and push it slightly inward
      let minDist = Infinity;
      let bestPoint = { x: 0, z: 0 };

      for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        const dx = p2.x - p1.x;
        const dz = p2.z - p1.z;
        const len = Math.sqrt(dx*dx + dz*dz);
        if (len === 0) continue;

        let t = ((item.position[0] - p1.x) * dx + (item.position[2] - p1.z) * dz) / (len * len);
        t = Math.max(0.1, Math.min(0.9, t));
        
        const projX = p1.x + t * dx;
        const projZ = p1.z + t * dz;
        const dist = Math.sqrt((item.position[0] - projX) ** 2 + (item.position[2] - projZ) ** 2);

        if (dist < minDist) {
          minDist = dist;
          const angle = Math.atan2(dz, dx);
          const nx = -Math.sin(angle);
          const nz = Math.cos(angle);
          // Push inward by 0.5m
          bestPoint = { x: projX + nx * 0.5, z: projZ + nz * 0.5 };
        }
      }
      item.position = [bestPoint.x, 0, bestPoint.z];
    }
  });

  return resolved;
};

export const autoFurnishRoom = async (
  vertices: Point[],
  attachments: Attachment[],
  prompt: string
): Promise<Furniture[]> => {
   const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});


  // Calculate door positions in world coordinates
  const doors = attachments.filter(a => a.type === 'door').map(door => {
    const p1 = vertices[door.wallIndex];
    const p2 = vertices[(door.wallIndex + 1) % vertices.length];
    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);
    const normal = { x: -Math.sin(angle), z: Math.cos(angle) };
    
    const centerX = p1.x + dx * door.ratio;
    const centerZ = p1.z + dz * door.ratio;
    
    return {
      position: [centerX, 0, centerZ],
      normal: [normal.x, 0, normal.z], // Direction facing into the room
      width: 1.0 // approximate width
    };
  });

  const windows = attachments.filter(a => a.type === 'window').map(window => {
    const p1 = vertices[window.wallIndex];
    const p2 = vertices[(window.wallIndex + 1) % vertices.length];
    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    
    const centerX = p1.x + dx * window.ratio;
    const centerZ = p1.z + dz * window.ratio;
    
    return {
      position: [centerX, 0, centerZ],
      width: 1.5 // approximate width
    };
  });

  const roomData = {
    vertices,
    doors,
    windows,
    catalog: FURNITURE_CATALOG.map(item => ({ id: item.url, name: item.name }))
  };

  const systemInstruction = `
You are an expert interior designer AI. Your task is to auto-furnish a room based on its floor plan, doors, windows, and the user's prompt.
You will receive the room's vertices (x, z coordinates), doors (with their world position and inward-facing normal vector), windows (world position), and a catalog of available furniture.

Important considerations:
1. Pathing: The doors array contains the exact [x, 0, z] coordinates of the entrances and their inward-facing normal vectors. You MUST create a clear walking path from these doors into the room. Do NOT place any furniture within 1.5 meters of a door's position, especially along its normal vector.
2. Windows: Avoid placing tall furniture (like wardrobes or bookshelves) directly in front of windows.
3. Orientation: Furniture should be oriented logically. For example, a sofa should face the center of the room or a focal point (like a TV). A coffee table should be placed in front of the sofa.
4. Spacing: Leave enough space (at least 0.8m) between furniture items for walking.
5. Boundaries: All furniture MUST be placed inside the polygon defined by the vertices.
6. Rotation: Rotation is in radians around the Y-axis. 0 means facing positive Z. Math.PI/2 means facing positive X.

Based on the user's prompt, select appropriate furniture from the catalog and place them in the room.
Return a JSON array of placed furniture objects.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Room Data: ${JSON.stringify(roomData)}\nUser Prompt: ${prompt || 'Furnish this room nicely.'}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              modelUrl: { type: Type.STRING, description: 'The ID (url) of the furniture from the catalog.' },
              position: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
                description: 'The [x, y, z] position of the furniture. y is usually 0.'
              },
              rotation: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
                description: 'The [x, y, z] rotation of the furniture in radians. Usually [0, rotationY, 0].'
              }
            },
            required: ['modelUrl', 'position', 'rotation']
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return [];

    const parsed = JSON.parse(resultText);
    const initialFurniture = parsed.map((item: any) => ({
      id: uuidv4(),
      modelUrl: item.modelUrl,
      position: item.position,
      rotation: item.rotation
    }));

    // Apply constraint solver to fix any AI mistakes
    return applyConstraints(initialFurniture, vertices, doors);
  } catch (error) {
    console.error('Auto furnish failed:', error);
    return [];
  }
};
