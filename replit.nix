{ pkgs }: {
  deps = [
    pkgs.nodePackages.vercel
    pkgs.wrangler
    pkgs.bun
    pkgs.tmux
    pkgs.gh
    
    # pkgs.opencode
  ];
}