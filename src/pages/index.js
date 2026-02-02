import Link from 'next/link'


export default function Home() {
return (
<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
<h1 className="text-3xl font-bold mb-4">Welcome to CRP Management System</h1>
<p className="mb-6 text-gray-600">Please login to continue</p>
<Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
Go to Login
</Link>
</div>
)
}