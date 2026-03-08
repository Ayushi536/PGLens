import React from "react";
import { Link } from "react-router-dom";

const Footer = React.forwardRef<HTMLElement>((_, ref) => (
  <footer ref={ref} className="border-t border-border bg-background">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground">
              PG
            </div>
            <span className="text-lg font-extrabold text-foreground">PG<span className="text-primary">Lens</span></span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">AI-powered PG & Co-living transparency platform.</p>
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Platform</h4>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-primary transition-colors">Explore PGs</Link>
            <Link to="/register" className="hover:text-primary transition-colors">List Your PG</Link>
            <a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Company</h4>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Blog</a>
            <a href="#" className="hover:text-primary transition-colors">Careers</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Legal</h4>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 PGLens. All rights reserved.
      </div>
    </div>
  </footer>
));

Footer.displayName = "Footer";
export default Footer;
