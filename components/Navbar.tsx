'use client';

import Image from "next/image"
import Link from "next/link"
import posthog from "posthog-js"

const Navbar = () => {
    const handleNavClick = (linkName: string) => {
        posthog.capture('nav_link_clicked', {
            link_name: linkName,
        });
    };

    return (
        <header>
            <nav>
                <Link href="/" className="logo" onClick={() => handleNavClick('logo')}>
                    <Image src="/icons/logo.png" alt="Logo" width={32} height={32} />
                    <p>Tech-Events</p>
                </Link>
                <ul>
                    <Link href="/" onClick={() => handleNavClick('Home')}>Home</Link>
                    <Link href="/events" onClick={() => handleNavClick('Events')}>Events</Link>
                    <Link href="/create" onClick={() => handleNavClick('Create Event')}>Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
