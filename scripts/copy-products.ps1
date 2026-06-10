$ErrorActionPreference = 'Stop'

$src = 'C:\Users\Alberto\PROGRAMACION\brio\imagenesmaria'
$dst = 'C:\Users\Alberto\PROGRAMACION\brio\brio\public\images\products'

# Map: original file name (with spaces) -> friendly short name
$mapping = [ordered]@{
  'WhatsApp Image 2026-06-08 at 02.18.31.jpeg'  = 'p01.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.32 (1).jpeg' = 'p02.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.32 (2).jpeg' = 'p03.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.32 (3).jpeg' = 'p04.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.32 (4).jpeg' = 'p05.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.32 (5).jpeg' = 'p06.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.32.jpeg'     = 'p07.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (1).jpeg' = 'p08.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (2).jpeg' = 'p09.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (3).jpeg' = 'p10.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (4).jpeg' = 'p11.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (5).jpeg' = 'p12.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (6).jpeg' = 'p13.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (7).jpeg' = 'p14.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33 (8).jpeg' = 'p15.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.33.jpeg'     = 'p16.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.34 (1).jpeg' = 'p17.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.34 (2).jpeg' = 'p18.jpeg'
  'WhatsApp Image 2026-06-08 at 02.18.34.jpeg'     = 'p19.jpeg'
}

$ok = 0
$fail = 0
foreach ($k in $mapping.Keys) {
  $from = Join-Path $src $k
  $to   = Join-Path $dst $mapping[$k]
  if (-not (Test-Path -LiteralPath $from)) {
    Write-Host "MISSING: $k"
    $fail++
    continue
  }
  try {
    Copy-Item -LiteralPath $from -Destination $to -Force
    $ok++
  } catch {
    Write-Host "FAIL: $k -> $($_.Exception.Message)"
    $fail++
  }
}
Write-Host "OK=$ok FAIL=$fail"
