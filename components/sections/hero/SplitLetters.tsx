import { cn } from '@/lib/utils'

type SplitLettersProps = {
  text: string
  className?: string
}

export default function SplitLetters({ text, className }: SplitLettersProps) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} className={cn('inline-block split-char', className)}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}
