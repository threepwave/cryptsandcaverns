# Starknet Setup on Mac M1

**Why do we need a special install guide?**
1. M1 Macs use a new architecture which is not compatible with some dependencies (e.g. homebrew). [More info](https://stackoverflow.com/questions/64963370/error-cannot-install-in-homebrew-on-arm-processor-in-intel-default-prefix-usr)*
2. OSX uses python 3.8 by default which is not compatible w/ nile. You want to use 3.7. [More Info](https://opensource.com/article/19/5/python-3-default-mac)

1. Install Homebrew
```
/usr/sbin/softwareupdate --install-rosetta --agree-to-license
arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```
*Note: From here on out, you need to use `arch -x86_64 brew install <package>` to install packages w/ homebrew.*

2. Install Python 3.7
```
arch -x86_64 brew install python@3.7
arch -x86_64 brew link python@3.7
```

Add the following env variables to your ~/.zprofile:
```
export PATH="/usr/local/opt/python@3.7/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/python@3.7/lib"
export PKG_CONFIG_PATH="/usr/local/opt/python@3.7/lib/pkgconfig"
```

To verify that python3.7 is installed correctly, the output of `python3 --version` should be 

3. Install required dependencies
```
arch -x86_64 brew install gmp
```

4. Install the latest Nile (equivalent to hardhat) with custom port availability
```
python3 -m venv env
source env/bin/activate
git clone https://github.com/OpenZeppelin/nile.git
pip install ./nile
```

5. Setup project
```nile init```

4. Compiling a sample contract (in /contracts directory)
```nile compile```

5. Deploying your contract
```nile deploy <yourcontractname>```
