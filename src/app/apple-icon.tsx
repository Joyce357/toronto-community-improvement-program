import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: 36,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 76,
          fontWeight: 900,
          letterSpacing: '-3px',
          position: 'relative',
        }}
      >
        <span style={{ color: '#FFFFFF' }}>T</span>
        <span style={{ color: '#16A34A' }}>C</span>
        <span style={{ color: '#FFFFFF' }}>IP</span>
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: '#D72638',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
