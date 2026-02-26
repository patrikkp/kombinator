import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      } else {
        if (password !== confirmPassword) {
          toast({ title: 'Greška', description: 'Lozinke se ne podudaraju.', variant: 'destructive' })
          setLoading(false)
          return
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        })
        if (error) throw error
        toast({ title: 'Registracija uspješna', description: 'Provjerite email za potvrdu računa.' })
      }
    } catch (error: any) {
      toast({ title: 'Greška', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      toast({ title: 'Greška', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col items-center"
        >
          <h1 className="text-6xl font-black tracking-tighter text-white mb-2">KOMBINATOR</h1>
          <p className="text-sm tracking-wide text-gray-400">Digitalni čuvar garancija</p>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-6 flex rounded-xl bg-white/5 p-1 border border-white/10">
          {[
            { label: 'Prijava', value: true },
            { label: 'Registracija', value: false },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setIsLogin(tab.value)}
              className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
                isLogin === tab.value ? 'text-white' : 'text-gray-400'
              }`}
            >
              {isLogin === tab.value && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute inset-0 rounded-lg bg-[#ff3131] shadow-lg shadow-[#ff3131]/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'register'}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, x: isLogin ? 20 : -20, transition: { duration: 0.2 } }}
            variants={{
              hidden: { opacity: 0, x: isLogin ? -20 : 20 },
              show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            onSubmit={handleEmailAuth}
            className="space-y-4"
          >
            <motion.div variants={fadeUp} className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vas@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-[#ff3131] focus:ring-[#ff3131]"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Lozinka</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-[#ff3131] focus:ring-[#ff3131]"
              />
            </motion.div>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="confirmPassword" className="text-gray-300">Potvrdite lozinku</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-[#ff3131] focus:ring-[#ff3131]"
                />
              </motion.div>
            )}
            <motion.div variants={fadeUp}>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-[#ff3131] text-white text-base font-semibold shadow-lg shadow-[#ff3131]/30 hover:bg-[#ff3131]/90 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Učitavanje...
                  </span>
                ) : isLogin ? 'Prijavi se' : 'Registriraj se'}
              </Button>
            </motion.div>
          </motion.form>
        </AnimatePresence>

        <motion.div variants={fadeUp} className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500">ili</span>
          <div className="h-px flex-1 bg-white/10" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="h-12 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Prijava putem Google računa
          </Button>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? 'Nemate račun? ' : 'Već imate račun? '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-[#ff3131] hover:underline">
            {isLogin ? 'Registrirajte se' : 'Prijavite se'}
          </button>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Auth