import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  /** App header with title and playful subheading */
  return (
    <header className="header">
      <h1 className="brand">
        <span aria-hidden="true">🪸</span> Ocean To‑Do
      </h1>
      <p className="tagline">Make waves with your tasks</p>
    </header>
  );
}
