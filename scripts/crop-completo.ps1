Add-Type -AssemblyName System.Drawing

function Crop-Logo {
  param(
    [string]$Source,
    [string]$Destination,
    [int]$TopPercent,
    [int]$BottomPercent
  )
  $img = [System.Drawing.Image]::FromFile($Source)
  $w = $img.Width
  $h = $img.Height
  $cropY = [int]($h * $TopPercent / 100)
  $cropH = [int]($h * ($BottomPercent - $TopPercent) / 100)

  $bmp = New-Object System.Drawing.Bitmap $w, $cropH
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $rect = New-Object System.Drawing.Rectangle 0, $cropY, $w, $cropH
  $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  $img.Dispose()
  Write-Host "Cropped: $Destination ($w x $cropH)"
}

# logobriocompleto: subir el top para incluir la Brío más arriba y reducir el espacio
Crop-Logo -Source 'C:\Users\Alberto\PROGRAMACION\brio\brio\public\images\logobriocompleto.png' -Destination 'C:\Users\Alberto\PROGRAMACION\brio\brio\public\images\logobriocompleto-cropped.png' -TopPercent 28 -BottomPercent 80
