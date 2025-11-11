$ErrorActionPreference = 'Stop'
$scriptPath = Join-Path $PSScriptRoot '..\LineAutoSave\line_auto_save_all_in_one.ps1'

Describe 'Pipeline' {
  It 'Pester boots' { $true | Should -BeTrue }
}

if (Test-Path $scriptPath) {
  . $scriptPath
  Describe 'Line Auto Save (core)' {
    It 'AllowedExtensions: image/video/audio contain expected items' {
      (Get-AllowedExtensions 'image') | Should -Contain '.jpg'
      (Get-AllowedExtensions 'video') | Should -Contain '.mp4'
      (Get-AllowedExtensions 'audio') | Should -Contain '.mp3'
    }
  }
} else {
  Context 'Line Auto Save' {
    It 'script not present -> mark pending for now' -Skip 'Place LineAutoSave/line_auto_save_all_in_one.ps1 to enable full tests'
  }
}
