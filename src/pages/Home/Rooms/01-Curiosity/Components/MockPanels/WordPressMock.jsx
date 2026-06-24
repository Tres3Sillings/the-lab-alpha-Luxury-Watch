import React from 'react'

export default function WordPressMock() {
  return (
    <div className="wp-mock">
      <div className="wp-badge-grid">
        <div className="wp-badge">
          <span className="wp-badge-icon">🌐</span>
          <span className="wp-badge-num">40+</span>
          <span className="wp-badge-lbl">Custom Pages Built</span>
        </div>
        <div className="wp-badge">
          <span className="wp-badge-icon">🔌</span>
          <span className="wp-badge-lbl">Plugin Installer</span>
          <span className="wp-badge-desc">Custom filters & hooks</span>
        </div>
      </div>
      <div className="wp-plugin-list">
        <h4>Custom Plugins built:</h4>
        <div className="wp-plugin-item">
          <span className="plugin-name">✓ WP Updater</span>
          <span className="plugin-status">Active</span>
        </div>
        <div className="wp-plugin-item">
          <span className="plugin-name">✓ WP Reviewer</span>
          <span className="plugin-status">Active</span>
        </div>
        <div className="wp-plugin-item">
          <span className="plugin-name">✓ WP Replacer</span>
          <span className="plugin-status">Active</span>
        </div>
      </div>
    </div>
  )
}
