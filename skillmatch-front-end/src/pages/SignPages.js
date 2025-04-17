import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { motion, AnimatePresence } from 'framer-motion';


export default function SignPages() {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleView = () => {
    setIsSignIn((prev) => !prev);
  };

  return (
    <div className="auth-wrapper">
      <AnimatePresence mode="wait">
        {isSignIn ? (
          <motion.div
            key="sign-in"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <SignIn onToggle={toggleView} />
          </motion.div>
        ) : (
          <motion.div
            key="sign-up"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <SignUp onToggle={toggleView} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
