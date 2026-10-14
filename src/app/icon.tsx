import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#171717',
          borderRadius: 7,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: '-0.5px',
          position: 'relative',
        }}
      >
        <span style={{ color: '#FFFFFF' }}>T</span>
        <span style={{ color: '#16A34A' }}>C</span>
        <span style={{ color: '#FFFFFF' }}>IP</span>
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: '#D72638',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
