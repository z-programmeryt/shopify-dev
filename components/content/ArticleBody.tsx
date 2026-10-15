import type { Block } from '@/data/articles'

/** Renders typed article blocks into semantic HTML (no MDX/runtime markdown parser needed). */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-rl">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'p':
            return <p key={index}>{block.text}</p>
          case 'h2':
            return (
              <h2 key={index} id={block.id}>
                {block.text}
              </h2>
            )
          case 'h3':
            return <h3 key={index}>{block.text}</h3>
          case 'ul':
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )
          case 'callout':
            return (
              <aside key={index} className="not-prose rounded-lg border-l-2 border-emerald-600 bg-emerald-50 px-5 py-4">
                <p className="font-semibold text-ink">{block.title}</p>
                <p className="mt-1 text-ink-soft">{block.text}</p>
              </aside>
            )
          case 'code':
            return (
              <pre key={index} aria-label={`${block.lang} code example`}>
                <code>{block.code}</code>
              </pre>
            )
          case 'table':
            return (
              <div key={index} className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      {block.head.map((cell) => (
                        <th key={cell} scope="col">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join('|')}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
