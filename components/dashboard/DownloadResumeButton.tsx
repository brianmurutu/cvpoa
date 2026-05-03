'use client'

interface DownloadResumeButtonProps {
  data: any
  filename?: string
}

export default function DownloadResumeButton({ data, filename = 'CV.json' }: DownloadResumeButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleDownload} className="btn-ghost text-xs py-1.5 px-3">
      Download JSON
    </button>
  )
}
