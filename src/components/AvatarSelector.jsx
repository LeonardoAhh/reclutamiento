import { useState, useEffect } from 'react'
import { createAvatar } from '@dicebear/core'
import * as collection from '@dicebear/collection'
import './AvatarSelector.css'

// Todos los estilos de DiceBear disponibles
const AVATAR_STYLES = [
    { id: 'adventurer', name: 'Adventurer', style: collection.adventurer },
    { id: 'adventurerNeutral', name: 'Adventurer Neutral', style: collection.adventurerNeutral },
    { id: 'avataaars', name: 'Avataaars', style: collection.avataaars },
    { id: 'avataaarsNeutral', name: 'Avataaars Neutral', style: collection.avataaarsNeutral },
    { id: 'bigEars', name: 'Big Ears', style: collection.bigEars },
    { id: 'bigEarsNeutral', name: 'Big Ears Neutral', style: collection.bigEarsNeutral },
    { id: 'bigSmile', name: 'Big Smile', style: collection.bigSmile },
    { id: 'bottts', name: 'Bottts', style: collection.bottts },
    { id: 'botttsNeutral', name: 'Bottts Neutral', style: collection.botttsNeutral },
    { id: 'croodles', name: 'Croodles', style: collection.croodles },
    { id: 'croodlesNeutral', name: 'Croodles Neutral', style: collection.croodlesNeutral },
    { id: 'dylan', name: 'Dylan', style: collection.dylan },
    { id: 'funEmoji', name: 'Fun Emoji', style: collection.funEmoji },
    { id: 'glass', name: 'Glass', style: collection.glass },
    { id: 'icons', name: 'Icons', style: collection.icons },
    { id: 'identicon', name: 'Identicon', style: collection.identicon },
    { id: 'initials', name: 'Initials', style: collection.initials },
    { id: 'lorelei', name: 'Lorelei', style: collection.lorelei },
    { id: 'loreleiNeutral', name: 'Lorelei Neutral', style: collection.loreleiNeutral },
    { id: 'micah', name: 'Micah', style: collection.micah },
    { id: 'miniavs', name: 'Miniavs', style: collection.miniavs },
    { id: 'notionists', name: 'Notionists', style: collection.notionists },
    { id: 'notionistsNeutral', name: 'Notionists Neutral', style: collection.notionistsNeutral },
    { id: 'openPeeps', name: 'Open Peeps', style: collection.openPeeps },
    { id: 'personas', name: 'Personas', style: collection.personas },
    { id: 'pixelArt', name: 'Pixel Art', style: collection.pixelArt },
    { id: 'pixelArtNeutral', name: 'Pixel Art Neutral', style: collection.pixelArtNeutral },
    { id: 'rings', name: 'Rings', style: collection.rings },
    { id: 'shapes', name: 'Shapes', style: collection.shapes },
    { id: 'thumbs', name: 'Thumbs', style: collection.thumbs }
]

// Función para generar avatar SVG
export const generateAvatarSvg = (styleId, seed) => {
    const styleConfig = AVATAR_STYLES.find(s => s.id === styleId)
    if (!styleConfig) return null

    const avatar = createAvatar(styleConfig.style, {
        seed: seed,
        size: 128
    })

    return avatar.toDataUri()
}

function AvatarSelector({ currentStyle, currentSeed, userName, onSelect, onClose }) {
    const [selectedStyle, setSelectedStyle] = useState(currentStyle || 'adventurer')
    const [seed, setSeed] = useState(currentSeed || userName || 'user')
    const [previews, setPreviews] = useState({})

    // Generar previews para todos los estilos
    useEffect(() => {
        const generatePreviews = () => {
            const newPreviews = {}
            AVATAR_STYLES.forEach(style => {
                try {
                    const avatar = createAvatar(style.style, {
                        seed: seed,
                        size: 64
                    })
                    newPreviews[style.id] = avatar.toDataUri()
                } catch (error) {
                    console.error(`Error generating ${style.id}:`, error)
                }
            })
            setPreviews(newPreviews)
        }
        generatePreviews()
    }, [seed])

    const handleRandomize = () => {
        const randomSeed = Math.random().toString(36).substring(7)
        setSeed(randomSeed)
    }

    const handleSelect = () => {
        onSelect(selectedStyle, seed)
        onClose()
    }

    return (
        <div className="avatar-selector-overlay" onClick={onClose}>
            <div className="avatar-selector-modal" onClick={e => e.stopPropagation()}>
                <div className="avatar-selector-header">
                    <h2>Selecciona tu Avatar</h2>
                    <button onClick={onClose} className="modal-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="avatar-selector-body">
                    {/* Preview del avatar seleccionado */}
                    <div className="avatar-preview-section">
                        <div className="avatar-preview-large">
                            {previews[selectedStyle] && (
                                <img src={previews[selectedStyle]} alt="Avatar preview" />
                            )}
                        </div>
                        <p className="avatar-style-name">
                            {AVATAR_STYLES.find(s => s.id === selectedStyle)?.name}
                        </p>
                        <div className="seed-controls">
                            <input
                                type="text"
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                placeholder="Semilla del avatar"
                                className="form-input seed-input"
                            />
                            <button onClick={handleRandomize} className="btn btn-outline btn-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="1 4 1 10 7 10"></polyline>
                                    <polyline points="23 20 23 14 17 14"></polyline>
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                                </svg>
                                Aleatorio
                            </button>
                        </div>
                    </div>

                    {/* Grid de estilos */}
                    <div className="avatar-styles-grid">
                        {AVATAR_STYLES.map(style => (
                            <button
                                key={style.id}
                                className={`avatar-style-option ${selectedStyle === style.id ? 'selected' : ''}`}
                                onClick={() => setSelectedStyle(style.id)}
                                title={style.name}
                            >
                                {previews[style.id] ? (
                                    <img src={previews[style.id]} alt={style.name} />
                                ) : (
                                    <div className="avatar-loading">...</div>
                                )}
                                <span className="avatar-style-label">{style.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="avatar-selector-footer">
                    <button onClick={onClose} className="btn btn-outline">
                        Cancelar
                    </button>
                    <button onClick={handleSelect} className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Guardar Avatar
                    </button>
                </div>
            </div>
        </div>
    )
}

export { AVATAR_STYLES }
export default AvatarSelector
