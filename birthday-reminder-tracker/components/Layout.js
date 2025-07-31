import Header from './Header'

export default function Layout({ children, authContext }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header authContext={authContext} />
      <main className="pb-8">
        {children}
      </main>
    </div>
  )
}