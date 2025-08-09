import React from "react";

export default function Banner() {
	return (
		<div className="bg-[var(--primary)] text-white text-center py-4" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, fontSize: "1.2rem", fontWeight: "bold"
		}}>
			LaunchPrint is live as of 09/08/2025! Found a bug? Report it to <a href="mailto:contact@deplo.yt" style={{textDecoration: "underline"}}>contact@deplo.yt</a>
		</div>
	);
}
