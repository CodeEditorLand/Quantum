import { createFile } from "../create-file.js";

interface CargoTomlParams {
	name: string;
	hasAutoupdater: boolean;
}

interface HandleCargoToml extends CargoTomlParams {
	path: string;
}

export async function handleCargoToml({
	path,
	...cargoTomlParams
}: HandleCargoToml) {
	return createFile(path, cargoToml(cargoTomlParams));
}

function cargoToml({ name, hasAutoupdater }: CargoTomlParams) {
	return `
[package]
name = "${name}"
version = "0.0.0"
description = "created with Quantum template"
license = ""
edition = "2021"

[lib]
name = "${name}_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[build-dependencies]
tauri-build = { version = "2.0.0-rc", features = [] }

[dependencies]
tauri = { version = "2.0.0-rc", features = [] }
tauri-plugin-shell = "2.0.0-rc"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tauri-plugin-devtools = "2.0.0-rc"
specta = "=2.0.0-rc.20"${
		hasAutoupdater ? '\ntauri-plugin-updater = "2.0.0-rc"' : ""
	}
tauri-plugin-dialog = "2.0.0-rc"
tauri-specta = { version = "=2.0.0-rc.15", features = ["derive", "javascript", "typescript"] }
specta-typescript = "0.0.7"
log = "0.4.22"


# Optimize for smaller binary size
[profile.release]
panic = "abort"   # Strip expensive panic clean-up logic
codegen-units = 1 # Compile crates one after another so the compiler can optimize better
lto = true        # Enables link to optimizations
opt-level = "s"   # Optimize for binary size
strip = true      # Remove debug symbols
    `;
}
