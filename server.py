#!/usr/bin/env python3

import os
import socket
import subprocess
import sys
import shutil


PORT = 8000


def is_port_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind(("127.0.0.1", port))
            return True
        except OSError:
            return False


def main() -> int:
    root = os.path.dirname(os.path.abspath(__file__))
    app_dir = os.path.join(root, "mme")

    if not os.path.isdir(app_dir):
        print(f"ERROR: No existe la carpeta del proyecto Next.js: {app_dir}", file=sys.stderr)
        return 1

    os.chdir(root)

    if not is_port_free(PORT):
        print(f"ERROR: El puerto {PORT} ya está en uso. Cierra el proceso que lo usa y reintenta.", file=sys.stderr)
        return 1

    env = os.environ.copy()
    env["PORT"] = str(PORT)

    npm = shutil.which("npm.cmd") or shutil.which("npm") or r"C:\Program Files\nodejs\npm.cmd"
    if not npm or not os.path.exists(npm):
        print("ERROR: No se encontró 'npm' (npm.cmd) en PATH. Instala Node.js LTS.", file=sys.stderr)
        return 1

    print(f"Servidor ejecutando en http://localhost:{PORT}/")
    print("Presiona Ctrl+C para detener el servidor")

    # Next.js dev server
    cmd = [npm, "run", "dev", "--", "-p", str(PORT)]
    try:
        proc = subprocess.Popen(cmd, cwd=app_dir, env=env)
    except FileNotFoundError:
        print("ERROR: No se pudo ejecutar npm. Reinstala Node.js LTS.", file=sys.stderr)
        return 1

    try:
        return int(proc.wait() or 0)
    except KeyboardInterrupt:
        try:
            proc.terminate()
            proc.wait(timeout=10)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass
        return 0


if __name__ == "__main__":
    raise SystemExit(main())

