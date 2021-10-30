import os

cwd = os.getcwd()
dirs = os.listdir(cwd)
dirs = [d for d in dirs if os.path.isdir(d)]

for d in dirs:
    cdd = os.chdir(os.path.join(cwd, d))
    tcd = os.getcwd()
    files = os.listdir(cdd)
    for f in files:
        os.remove(os.path.join(tcd, f))


print(dirs)