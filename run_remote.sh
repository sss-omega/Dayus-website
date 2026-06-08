#!/bin/bash
# Helper script to run commands on the remote server 'omega'
# and print their stdout and stderr cleanly.

COMMAND="$@"
ssh -o StrictHostKeyChecking=no omega "$COMMAND" 2>&1
