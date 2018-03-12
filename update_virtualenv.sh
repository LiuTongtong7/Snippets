#!/bin/bash
source virtualenvwrapper.sh
for env_name in $(workon); do
    echo ${env_name}
    env_path="${WORKON_HOME}/${env_name}"
    gfind ${env_path} -type l -xtype l -delete
    python_flag=""
    if [[ ${env_name} =~ "3" ]]; then
        python_flag="-p python3"
    else
        python_flag="-p python2"
    fi
    ssp_flag=""
    if [[ ${env_name} =~ "@" ]]; then
        ssp_flag="--system-site-packages"
    fi
    echo "virtualenv ${python_flag} ${ssp_flag} ${env_path}"
    virtualenv ${python_flag} ${ssp_flag} ${env_path}
done
