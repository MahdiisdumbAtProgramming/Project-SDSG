#!/usr/bin/env python3
import os

EXCLUDE = {"nopers", "cache", "music", "mods"}

def get_dir_size(path):
    """Recursively get total size of a directory in bytes."""
    total = 0
    for dirpath, dirnames, filenames in os.walk(path):
        # Skip excluded directories during walk
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE]
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if not os.path.islink(fp):
                try:
                    total += os.path.getsize(fp)
                except FileNotFoundError:
                    pass
    return total

def human_readable_size(size):
    """Convert bytes to a human-readable string."""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024:
            return f"{size:.2f} {unit}"
        size /= 1024
    return f"{size:.2f} PB"

def main():
    current = os.getcwd()
    total_size = 0
    for entry in os.scandir(current):
        if entry.is_dir() and entry.name not in EXCLUDE:
            size = get_dir_size(entry.path)
            print(f"{entry.name}: {human_readable_size(size)}")
            total_size += size
    print("-" * 40)
    print(f"Total (excluding {', '.join(EXCLUDE)}): {human_readable_size(total_size)}")

if __name__ == "__main__":
    main()
