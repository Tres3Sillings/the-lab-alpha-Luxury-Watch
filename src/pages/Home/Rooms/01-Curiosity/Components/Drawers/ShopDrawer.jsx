import React from 'react'

export const SHOP_ITEMS = [
  {
    id: 'popper',
    title: 'Confetti Popper Button',
    desc: 'Unlocks a party popper button to burst colors across your screen!',
    cost: 25,
    icon: '🎉'
  },
  {
    id: 'cursor_phosphor',
    title: 'Phosphor Green Cursor',
    desc: 'Retro CRT computer crosshair pointer that flickers green on interactive hovers.',
    cost: 50,
    icon: '🟢'
  },
  {
    id: 'cursor_flame',
    title: 'Fire Flame Cursor',
    desc: 'Leaves a trailing path of burning orange-red embers as you sweep the mouse.',
    cost: 75,
    icon: '🔥'
  },
  {
    id: 'cursor_matrix',
    title: 'Matrix Digital Rain Cursor',
    desc: 'Leaves trailing digital green numbers cascading behind the cursor.',
    cost: 90,
    icon: '💾'
  },
  {
    id: 'cursor_gold',
    title: 'Golden Creator Cursor',
    desc: 'Custom gold star pointer that leaves a sparkling trailing dust path as you slide the mouse.',
    cost: 100,
    icon: '🌟'
  },
  {
    id: 'cursor_rainbow',
    title: 'Rainbow Sparkle Cursor',
    desc: 'Leaves trailing starburst sparkles that shift colors dynamically.',
    cost: 120,
    icon: '🌈'
  },
  {
    id: 'theme_crt_amber',
    title: 'CRT Amber Screen Upgrade',
    desc: 'Toggleable vintage amber theme for the CRT computer monitor.',
    cost: 30,
    icon: '🍊'
  },
  {
    id: 'glitch_burst',
    title: 'Glitch Matrix Burst Button',
    desc: 'Trigger a CRT screen shake glitch pulse and play a matrix hacker sound effect.',
    cost: 40,
    icon: '⚡'
  },
  {
    id: 'cassette_lofi',
    title: 'Cassette Lo-Fi Player',
    desc: 'Play synthesized lo-fi beats with custom vinyl tape crackle, built entirely in Web Audio API.',
    cost: 80,
    icon: '📻'
  },
  {
    id: 'sound_effects',
    title: 'Sound Effects Pack',
    desc: 'Adds subtle tactile hover and click sounds to every button in the room. Satisfying, barely-there, and premium feeling.',
    cost: 60,
    icon: '🔊'
  },
  {
    id: 'contact_card',
    title: 'Direct Contact Card',
    desc: 'Unlock direct email, phone details, and a secret high-priority message form!',
    cost: 150,
    icon: '✉️'
  }
]

export default function ShopDrawer({
  showShop,
  setShowShop,
  walletBalance,
  unlockedShopItems,
  activeCursor,
  handleBuyItem,
  handleEquipCursor,
  triggerConfettiExplosion,
  crtTheme,
  setCrtTheme,
  triggerGlitchBurst,
  lofiPlaying,
  toggleLofiPlaying,
  soundsEnabled,
  toggleSoundsEnabled
}) {
  return (
    <div className={`shop-drawer ${showShop ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3>🏪 SHOP</h3>
        <button className="close-drawer" onClick={() => setShowShop(false)}>×</button>
      </div>

      <div className="shop-wallet-section">
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-amount">💰 {walletBalance} <span className="wallet-unit">PTS</span></div>
        <p className="wallet-desc">Unlock achievements and claim points to buy interactive room upgrades and cosmetic rewards.</p>
      </div>

      <div className="shop-items-list">
        {SHOP_ITEMS.map((item) => {
          const isUnlocked = unlockedShopItems.includes(item.id)
          const isActive = (item.id === 'cursor_phosphor' && activeCursor === 'phosphor') ||
            (item.id === 'cursor_gold' && activeCursor === 'gold') ||
            (item.id === 'cursor_flame' && activeCursor === 'flame') ||
            (item.id === 'cursor_matrix' && activeCursor === 'matrix') ||
            (item.id === 'cursor_rainbow' && activeCursor === 'rainbow')

          return (
            <div key={item.id} className={`shop-item ${isUnlocked ? 'owned' : 'buyable'}`}>
              <div className="shop-item-icon-wrapper">
                <span className="shop-item-icon">{item.icon}</span>
              </div>
              <div className="shop-item-info">
                <div className="shop-item-title-row">
                  <span className="shop-item-title">{item.title}</span>
                  <span className="shop-item-cost">{isUnlocked ? 'OWNED' : `💰 ${item.cost} PTS`}</span>
                </div>
                <p className="shop-item-desc">{item.desc}</p>

                <div className="shop-item-actions">
                  {!isUnlocked ? (
                    <button
                      className="buy-btn"
                      disabled={walletBalance < item.cost}
                      onClick={() => handleBuyItem(item.id, item.cost)}
                    >
                      Buy Item
                    </button>
                  ) : (
                    <>
                      {item.id === 'popper' && (
                        <button className="pop-btn" onClick={triggerConfettiExplosion}>
                          🎉 POP CONFETTI!
                        </button>
                      )}

                      {(item.id === 'cursor_phosphor' || item.id === 'cursor_gold' || item.id === 'cursor_flame' || item.id === 'cursor_matrix' || item.id === 'cursor_rainbow') && (
                        <button
                          className={`equip-btn ${isActive ? 'active' : ''}`}
                          onClick={() => handleEquipCursor(
                            item.id === 'cursor_phosphor' ? 'phosphor' :
                              item.id === 'cursor_gold' ? 'gold' :
                                item.id === 'cursor_flame' ? 'flame' :
                                  item.id === 'cursor_matrix' ? 'matrix' : 'rainbow'
                          )}
                        >
                          {isActive ? '● ACTIVE' : 'EQUIP'}
                        </button>
                      )}

                      {item.id === 'theme_crt_amber' && (
                        <button
                          className={`equip-btn ${crtTheme === 'amber' ? 'active' : ''}`}
                          onClick={() => setCrtTheme(crtTheme === 'amber' ? 'green' : 'amber')}
                        >
                          {crtTheme === 'amber' ? '● AMBER ACTIVE' : 'EQUIP AMBER'}
                        </button>
                      )}

                      {item.id === 'glitch_burst' && (
                        <button className="pop-btn" onClick={triggerGlitchBurst}>
                          ⚡ TRIGGER GLITCH!
                        </button>
                      )}

                      {item.id === 'cassette_lofi' && (
                        <div className="lofi-player-box">
                          <div className={`cassette-tape-animation ${lofiPlaying ? 'playing' : ''}`}>
                            <div className="spindle left"></div>
                            <div className="spindle right"></div>
                          </div>
                          <button className={`play-lofi-btn ${lofiPlaying ? 'playing' : ''}`} onClick={toggleLofiPlaying}>
                            {lofiPlaying ? '⏸ PAUSE LO-FI' : '▶ PLAY LO-FI'}
                          </button>
                        </div>
                      )}

                      {item.id === 'sound_effects' && (
                        <button 
                          className={`equip-btn ${soundsEnabled ? 'active' : ''}`}
                          onClick={toggleSoundsEnabled}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          {soundsEnabled ? '🔊 SOUNDS ON' : '🔇 SOUNDS OFF'}
                        </button>
                      )}

                      {item.id === 'contact_card' && (
                        <div className="contact-reveal-box">
                          <div className="revealed-header">✉️ PREMIUM CONTACT INFO</div>
                          <div className="contact-detail"><strong>Email:</strong> <a href="mailto:tres3sillings@gmail.com"> tres3sillings@gmail.com</a></div>
                          <div className="contact-detail"><strong>Phone:</strong> <a href="tel:2177039256">(217) 703-9256</a></div>
                          <div className="contact-detail"><strong>GitHub:</strong> <a href="https://github.com/Tres3Sillings" target="_blank" rel="noreferrer">github.com/Tres3Sillings</a></div>
                          <div className="contact-message-form">
                            <div className="form-header">Priority Transmission (Decrypted)</div>
                            <input type="text" placeholder="Your Name" className="contact-input" />
                            <textarea placeholder="Message..." className="contact-textarea" rows="2"></textarea>
                            <button className="contact-submit-btn" onClick={() => alert('Message transmitted successfully!')}>Transmit</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {(unlockedShopItems.includes('cursor_phosphor') || unlockedShopItems.includes('cursor_gold') || unlockedShopItems.includes('cursor_flame') || unlockedShopItems.includes('cursor_matrix') || unlockedShopItems.includes('cursor_rainbow')) && (
          <div className="shop-item owned default-cursor-row">
            <div className="shop-item-icon-wrapper"><span className="shop-item-icon">↗️</span></div>
            <div className="shop-item-info">
              <div className="shop-item-title-row">
                <span className="shop-item-title">Standard Cursor</span>
                <span className="shop-item-cost">FREE</span>
              </div>
              <div className="shop-item-actions">
                <button
                  className={`equip-btn ${activeCursor === 'default' ? 'active' : ''}`}
                  onClick={() => handleEquipCursor('default')}
                >
                  {activeCursor === 'default' ? '● ACTIVE' : 'EQUIP'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
