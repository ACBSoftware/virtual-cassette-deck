
Code for the project in this video:

 https://www.youtube.com/watch?v=QLU8IWPpnqM


Disclaimer:
(1) Use at own risk
(2) No support, not  aproduct
(3) Very rough around the edges, work in progress


*Contents of beeweb config file:

C:\Users\WindowsUser\AppData\Roaming\foobar2000-v2\user-components\foo_beefweb\beefweb.config.json

```
{
    "musicDirs": ["S:\\SinglesByYear","S:\\Artists"],
    "allowRemote": true,
    "responseHeaders": {
        "Access-Control-Allow-Origin": "*"
    }
}
```

Script to add to index.html:

```	
		<script defer="defer">setTimeout(function(){window.scrollTo(0,0)},500)</script>
```

* Tip: Search to images.google.com to find better buttons
* Tip: In the backend project, find "Batman" or "WindowsUser" and replace with your user name


*PC Configuration steps:

0. Start w/Beelink PC with Windows Pro Installed & local account WindowsUser
1. Explorer->View->Show->FileName Extensions & Hidden Items
2. Explorer->PC->Properties->Rename PC
3. Connect to Ethernet, go to Google.com, install Chrome.
4. Show all Taskbar icons
5. Remove OneDrive from Registry startup
6. Run Windows Updates, Reboot
7. Under Settings->Network & Internet  -> Ethernet change this to a private network
8. Run->control->Control Panel\Network and Internet\Network and Sharing Center\Advanced sharing settings --> Turn on Network Discovery/File Sharing for Private Networks
9. Add shortcut to this PC on desktop
10. Set up registry entries for auto admin logon
11. Reboot again for more updates! And again!
12. Install Foobar2000 32-bit + Beefweb component
13. Plug in monitor
14. Make the touch display monitor 1 and then Control Panel->Hardware and Sound->Calibrate
15. Install VS Code & exit
16. Install Node.js (used node-v20.11.1-x64) (Also installs python etc)
17. Reboot to update all the paths...
18. At a command prompt, run npm install -g @angular/cli
19. Create Dev folder and share it. Copy app files over from other PC..
20. Open in VSCode, Trust, Install Angular extension, get app running
21. Settings --> Typing -> "Show the touch keyboard in windowed apps when there's no keyboard attached"
22. Run Powershell in admin mode and Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
23. Enable Stereo Mix recording device in control panel
24. Navigate to the Communications tab inside the Sound control panel window. Then select the Do nothing option under When Windows detects communication activity.
25. chrome://flags Disable Allow WebRTC to adjust the input volume.
26. Python extension for VSCode
27. Firewall -> Advanced -> Inbound Rules -> New -> Port -> 8880 -> Allow -> Private
28. 	pip install selenium
	pip install uvicorn
	pip install -r requirements.txt


* Helpful articles

https://answers.microsoft.com/en-us/windows/forum/all/stereo-mix-not-working/cb8da2a6-517d-466f-8cf3-880d87696eb0
https://code.visualstudio.com/docs/python/tutorial-fastapi
https://medium.com/@sbasil.ahamed/automate-google-image-search-with-python-and-selenium-bad89aed41f3s



