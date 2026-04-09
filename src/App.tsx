/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductGrid from "./components/ProductGrid";
import Story from "./components/Story";
import Process from "./components/Process";
import Reviews from "./components/Reviews";
import Recipes from "./components/Recipes";
import OrderForm from "./components/OrderForm";
import Footer from "./components/Footer";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./components/Checkout";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailure from "./components/PaymentFailure";
import CartDrawer from "./components/CartDrawer";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { AuthProvider } from "./lib/AuthContext";
import { CartProvider } from "./lib/CartContext";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainApp() {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isDashboard = location.pathname === "/admin" || location.pathname === "/dashboard";

  return (
    <div className="relative min-h-screen selection:bg-saffron selection:text-white overflow-x-hidden">
      <ScrollToTop />
      {/* Film Grain Overlay */}
      <div className="grain" />
      
      <CustomCursor />
      
      {/* Scroll Progress Bar */}
      {!isDashboard && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-saffron z-[100] origin-left"
          style={{ scaleX }}
        />
      )}

      {!isDashboard && <Navbar />}
      
      <CartDrawer />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <ProductGrid />
              <Process />
              <Reviews />
              <Recipes />
              <OrderForm />
            </>
          } />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainApp />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
