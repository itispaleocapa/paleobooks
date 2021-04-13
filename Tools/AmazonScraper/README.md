# Amazon scraper

This scraper extract the list of classes and the list of books from the site adozionilibriscolastici.it.

Due to the API rate limit, you'll need to change your public IP address several times to complete the execution of the script. When prompted, change the IP address and press enter.

If you your provider offers you a dynamic IP, you need to reboot your router.

If you have a static IP address, you can use a VPN, such as [ProtonVPN](https://protonvpn.com/it/) (free) or [NordVPN](https://nordvpn.com/it/) (paid), and change the server every time you need a new IP.

Sections of the first two years of the branch 'SISTEMA MODA' are usually combined with sections of another branch. In the school years 2019/2020 and 2020/2021 it was 'INFORMATICA E TELECOMUNICAZIONI'. The section names were 1TI and 2TI. If this changes, you would like to check end edit line 55 of `scraper.php`.

The script is meant to be run from the command line, not from a web server.  
Tested and working on PHP 7.4.16.

Output files:
- `classi_diurno_[TIMESTAMP].json` contains the list of books for each class of the *diurno* course;
- `classi_serale_[TIMESTAMP].json` contains the list of books for each class of the *serale* course;
- `libri_[TIMESTAMP].json` contains the list of all the books with more details.

### Usage
```
php scraper.php
```
And follow the on-screen instructions.

### Sample output
In the `sample` directory there are the output files of the school years 2019/2020 and 2020/2021.
