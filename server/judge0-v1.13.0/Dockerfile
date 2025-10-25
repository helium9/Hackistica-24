FROM judge0/judge0:1.13.0

# Create isolate wrapper to strip cgroup v1 flags
RUN mv /usr/local/bin/isolate /usr/local/bin/isolate.real && \
    cat > /usr/local/bin/isolate << 'EOF'
#!/bin/bash
# Remove --cg, --cg-timing, and --cg-mem flags for cgroup v2 compatibility
args=()
skip_next=false
for arg in "$@"; do
  if [ "$skip_next" = true ]; then
    skip_next=false
    continue
  fi
  case "$arg" in
    --cg|--cg-timing)
      continue
      ;;
    --cg-mem=*)
      continue
      ;;
    --cg-mem)
      skip_next=true
      continue
      ;;
    *)
      args+=("$arg")
      ;;
  esac
done
exec /usr/local/bin/isolate.real "${args[@]}"
EOF

RUN chmod +x /usr/local/bin/isolate
