import { useRef } from 'react'
import '../styles/ImageUpload.css'

function ImageUpload({ onImagesUpload, uploadedCount, onStartGame }) {
  const fileInputRef = useRef(null)

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      onImagesUpload(files)
      // Reset input so same file can be selected again
      e.target.value = ''
    }
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-upload">
      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-box" onClick={handleUploadClick}>
          <div className="upload-icon">📸</div>
          <h2>Upload Your Images</h2>
          <p>Click or drag to select one or more images</p>
          <button className="upload-button">Choose Files</button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
      </div>

      {/* Status */}
      {uploadedCount > 0 && (
        <div className="upload-status">
          <p>
            {uploadedCount} image{uploadedCount !== 1 ? 's' : ''} uploaded
          </p>
        </div>
      )}

      {/* Start Game Button */}
      {uploadedCount > 0 && (
        <div className="action-buttons">
          <button
            className="start-button"
            onClick={onStartGame}
          >
            🎮 Start Game
          </button>
          <button
            className="upload-more-button"
            onClick={handleUploadClick}
          >
            ➕ Add More Images
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
