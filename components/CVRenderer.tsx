import React from 'react'

export default function CVRenderer({ data, theme = 'modern' }: { data: any, theme?: string }) {
  if (!data) return null

  const getThemeClasses = () => {
    switch (theme) {
      case 'corporate': return 'bg-white text-slate-900 font-serif'
      case 'creative': return 'bg-[#FAF9F6] text-stone-900 font-sans border-t-8 border-brand-500'
      default: return 'bg-white text-ink-950 font-sans' // modern
    }
  }

  const getHeaderClasses = () => {
    switch (theme) {
      case 'corporate': return 'text-center border-b-2 border-slate-800 pb-4 mb-6'
      case 'creative': return 'flex justify-between items-end pb-4 mb-6 border-b border-brand-200'
      default: return 'mb-6 pb-6 border-b border-ink-200' // modern
    }
  }

  return (
    <div className={`p-8 w-full max-w-[800px] mx-auto min-h-[1056px] shadow-xl ${getThemeClasses()}`} id="cv-preview">
      {/* Header */}
      <header className={getHeaderClasses()}>
        <div>
          <h1 className={`text-4xl font-bold ${theme === 'corporate' ? 'text-slate-900' : 'text-brand-600'}`}>
            {data.fullName || 'Candidate Name'}
          </h1>
          <p className={`text-sm mt-2 ${theme === 'corporate' ? 'opacity-90' : 'text-ink-600'}`}>
            {data.email} {data.phone ? `• ${data.phone}` : ''} {data.location ? `• ${data.location}` : ''}
            {data.linkedin && ` • ${data.linkedin}`}
          </p>
        </div>
        {theme === 'creative' && data.targetRole && (
          <div className="text-right text-brand-600 font-medium text-lg max-w-[250px]">
            {data.targetRole}
          </div>
        )}
      </header>

      {/* Summary */}
      {data.professionalSummary && (
        <section className="mb-6">
          <h2 className={`text-lg font-bold uppercase tracking-wider mb-2 border-b pb-1 ${theme === 'modern' ? 'border-ink-200 text-brand-600' : 'border-current'}`}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{data.professionalSummary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-bold uppercase tracking-wider mb-3 border-b pb-1 ${theme === 'modern' ? 'border-ink-200 text-brand-600' : 'border-current'}`}>
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-base">{exp.title}</h3>
                  <span className="text-sm font-medium">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <div className={`text-sm font-medium mb-2 ${theme === 'corporate' ? 'opacity-90' : 'text-brand-600'}`}>
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {exp.bullets.map((b: string, j: number) => (
                      <li key={j} className="pl-1 leading-relaxed">{b.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className={`text-lg font-bold uppercase tracking-wider mb-3 border-b pb-1 ${theme === 'modern' ? 'border-ink-200 text-brand-600' : 'border-current'}`}>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-base">{edu.degree}</h3>
                  <span className="text-sm font-medium">{edu.graduationYear}</span>
                </div>
                <div className="text-sm font-medium opacity-90">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</div>
                {edu.achievements && <div className="text-sm italic mt-1 opacity-80">{edu.achievements}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && (
        <section>
          <h2 className={`text-lg font-bold uppercase tracking-wider mb-3 border-b pb-1 ${theme === 'modern' ? 'border-ink-200 text-brand-600' : 'border-current'}`}>
            Skills
          </h2>
          <div className="text-sm space-y-1.5 leading-relaxed">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div><span className="font-semibold">Technical:</span> {data.skills.technical.join(', ')}</div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div><span className="font-semibold">Soft Skills:</span> {data.skills.soft.join(', ')}</div>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <div><span className="font-semibold">Tools:</span> {data.skills.tools.join(', ')}</div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
