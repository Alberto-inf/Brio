Add-Type -AssemblyName System.Drawing
$path1 = 'C:\Users\Alberto\PROGRAMACION\brio\brio\public\images\logobrio.png'
$path2 = 'C:\Users\Alberto\PROGRAMACION\brio\brio\public\images\logobriocompleto.png'
$path3 = 'C:\Users\Alberto\PROGRAMACION\brio\brio\public\images\logo-w.jpg'
$path4 = 'C:\Users\Alberto\PROGRAMACION\brio\brio\public\images\logo-b.jpg'

foreach ($p in @($path1, $path2, $path3, $path4)) {
  $img = [System.Drawing.Image]::FromFile($p)
  Write-Host "$([System.IO.Path]::GetFileName($p)): $($img.Width) x $($img.Height)"
  $img.Dispose()
}
