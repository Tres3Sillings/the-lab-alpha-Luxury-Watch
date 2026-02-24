--- /dev/null
+++ c:\Users\TresSillings\Projects\The Lab\the-lab-alpha\src\components\home\IntroOverlay.jsx
@@ -0,0 +1,44 @@
+import React from 'react'
+import { motion, AnimatePresence } from 'framer-motion'
+
+export function IntroOverlay({ isStarted, onStart, activeProject, onReset }) {
+  return (
+    <>
+      <AnimatePresence mode="wait">
+        {!isStarted ? (
+          <motion.div 
+            key="intro"
+            initial={{ opacity: 1 }}
+            exit={{ opacity: 0, y: -100 }}
+            transition={{ duration: 1 }}
+            className="hero-overlay"
+          >
+            <h1 className="title">FETCH & FIX // DIGITAL</h1>
+            <p className="subtitle">WELCOME TO THE LAB 3.0</p>
+            <button className="enter-btn" onClick={onStart}>ENTER THE LAB</button>
+          </motion.div>
+        ) : activeProject ? (
+          // BACK BUTTON WHEN ZOOMED IN
+          <motion.div 
+            key="back-ui"
+            initial={{ opacity: 0 }}
+            animate={{ opacity: 1 }}
+            style={{ position: 'absolute', top: 40, left: 40, zIndex: 100 }}
+          >
+             <button className="enter-btn" onClick={onReset}>← BACK TO LAB</button>
+          </motion.div>
+        ) : null}
+      </AnimatePresence>
+      <style>{`
+        .hero-overlay {
+          position: absolute; z-index: 10; width: 100%; height: 100%;
+          display: flex; flex-direction: column; align-items: center; justify-content: center;
+          background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
+        }
+        .title { color: white; font-family: 'Inter', sans-serif; font-size: 4rem; letter-spacing: 15px; margin: 0; text-align: center; }
+        .subtitle { color: #00f2ff; font-family: 'monospace'; letter-spacing: 5px; margin-top: 10px; }
+        .enter-btn {
+          pointer-events: auto; margin-top: 50px; padding: 15px 40px;
+          background: none; border: 2px solid #00f2ff; color: #00f2ff;
+          font-family: 'Inter', sans-serif; font-weight: bold; cursor: pointer;
+          letter-spacing: 3px; transition: 0.3s;
+        }
+        .enter-btn:hover { background: #00f2ff; color: black; }
+      `}</style>
+    </>
+  )
+}
