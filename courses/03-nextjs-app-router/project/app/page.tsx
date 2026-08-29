import Image from 'next/image'
import ChallengeList from './components/ChallengeList'
import Link from 'next/link'
import Counter from './components/Counter'

export const dynamic = 'force-static'

export default function Home() {
  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Next.js App Router Project</h1>

        {/* nextImage: Next.js optimized image */}
        <Image
          src="/nextjs.png"
          alt="Next.js logo"
          width={200}
          height={100}
        />

        <Link href="/about">About</Link>

        <p>Complete the challenges to build your Next.js skills!</p>

        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Work on challenges by modifying code in <code>app/</code> directory.
          Run <code>npm run dev</code> to see your changes.
        </p>
      </header>

      <Counter />
      <ChallengeList />
    </main>
  )
}