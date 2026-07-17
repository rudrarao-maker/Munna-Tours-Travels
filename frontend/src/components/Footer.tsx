export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--footer-bg)' }} className="text-white pt-12 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">TripNova Holidays</h3>
          <p style={{ color: 'var(--footer-text)' }}>Your Journey, Our Responsibility. Discover the world with premium comfort and safety.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2" style={{ color: 'var(--footer-text)' }}>
            <li><a href="/routes" className="hover:text-white transition-colors">All Routes</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2" style={{ color: 'var(--footer-text)' }}>
            <li><a href="/faq" className="hover:text-white transition-colors">FAQs</a></li>
            <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact Us</h4>
          <p style={{ color: 'var(--footer-text)' }}>Email: support@tripnovaholidays.com</p>
          <p style={{ color: 'var(--footer-text)' }}>Phone: +91 98765 43210</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 text-center" 
        style={{ borderTop: '1px solid var(--footer-border)', color: 'var(--footer-text)' }}>
        &copy; {new Date().getFullYear()} TripNova Holidays. All rights reserved.
      </div>
    </footer>
  );
}
