#!/usr/bin/env bash

# Where to store per-window title bar states
CACHE="$HOME/.glazewm-titlebar-window-states"

# Get current focused window ID
win_id=$(glazewm query focused | jq -r '.data.focused.id')

state="shown" # default
if grep -q "^$win_id=" "$CACHE" 2>/dev/null; then
    state=$(grep "^$win_id=" "$CACHE" | cut -d= -f2)
fi

if [[ "$state" == "shown" ]]; then
    new_state="hidden"
else
    new_state="shown"
fi

glazewm command set-title-bar-visibility "$new_state"

grep -v "^$win_id=" "$CACHE" > "$CACHE.tmp"
echo "$win_id=$new_state" >> "$CACHE.tmp"
mv "$CACHE.tmp" "$CACHE"
