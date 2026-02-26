import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-9xl font-black text-[#ff3131] mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Stranica nije pronađena</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-[#ff3131] text-white rounded-xl font-semibold hover:bg-[#ff3131]/90 transition-colors"
      >
        Povratak na početnu
      </Link>
    </motion.div>
  </div>
)

export default NotFound