@echo off
:REDO
git add .
git commit -m "commit"
git push origin master
cmd /c start https://github.com/fpicerdas/amayya_tower
:choice
set /P c=Redo or Exit[r/x]?
if /I "%c%" EQU "R" goto :REDO
if /I "%c%" EQU "x" goto :EXIT
goto :CHOICE
pause
:EXIT