const Footer = () => {
  return (
    // The footer has a top border to separate it from the main content.
    <footer className="border-t border-border py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
        {/* We can use a 'mailto:' link for a simple contact method. */}
          <a href="mailto:basilisk5679@gmail.com" className="hover:text-primary transition-colors">
            Contact Us
          </a>
          {/* We can add other links here later, like 'Terms of Service'. */}
        </div>
        <p className="mt-4 text-xs text-muted-foreground/80">
          &copy; 2025 YomiRen. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;