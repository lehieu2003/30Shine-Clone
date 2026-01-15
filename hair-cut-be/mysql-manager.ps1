# MySQL Service Manager for Hair Cut Application
# Kiểm tra và khởi động MySQL service

param(
    [string]$Action = "check"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-ColorMessage {
    param($Message, $Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-MySQLService {
    $services = @("MySQL80", "MySQL", "MySQL57", "MySQL56", "MYSQL")
    foreach ($serviceName in $services) {
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        if ($service) {
            return $service
        }
    }
    return $null
}

function Test-MySQLConnection {
    try {
        # Test connection using .NET MySQL connector approach
        $connectionString = "server=localhost;port=3306;uid=root;"
        
        # Simple TCP test
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.ReceiveTimeout = 3000
        $tcpClient.SendTimeout = 3000
        
        $result = $tcpClient.BeginConnect("localhost", 3306, $null, $null)
        $success = $result.AsyncWaitHandle.WaitOne(3000, $false)
        
        if ($success) {
            $tcpClient.EndConnect($result)
            $tcpClient.Close()
            return $true
        } else {
            $tcpClient.Close()
            return $false
        }
    } catch {
        return $false
    }
}

function Show-Status {
    Write-ColorMessage "`n=== MYSQL SERVICE STATUS ===" $Blue
    
    $mysqlService = Get-MySQLService
    if ($mysqlService) {
        Write-ColorMessage "Service Name: $($mysqlService.Name)" $Green
        Write-ColorMessage "Status: $($mysqlService.Status)" $(if ($mysqlService.Status -eq "Running") { $Green } else { $Red })
        Write-ColorMessage "Start Type: $($mysqlService.StartType)" $Yellow
    } else {
        Write-ColorMessage "❌ Không tìm thấy MySQL service!" $Red
        Write-ColorMessage "Vui lòng cài đặt MySQL Server trước." $Yellow
        return $false
    }
    
    Write-ColorMessage "`n=== CONNECTION TEST ===" $Blue
    $connectionTest = Test-MySQLConnection
    if ($connectionTest) {
        Write-ColorMessage "✅ MySQL đang chạy và có thể kết nối!" $Green
        return $true
    } else {
        Write-ColorMessage "❌ Không thể kết nối đến MySQL!" $Red
        return $false
    }
}

function Start-MySQLService {
    $mysqlService = Get-MySQLService
    if (-not $mysqlService) {
        Write-ColorMessage "❌ Không tìm thấy MySQL service!" $Red
        return $false
    }
    
    if ($mysqlService.Status -eq "Running") {
        Write-ColorMessage "✅ MySQL đã đang chạy!" $Green
        return $true
    }
    
    Write-ColorMessage "🔄 Đang khởi động MySQL service..." $Yellow
    
    if (-not (Test-AdminRights)) {
        Write-ColorMessage "❌ Cần quyền Administrator để khởi động service!" $Red
        Write-ColorMessage "Vui lòng:" $Yellow
        Write-ColorMessage "1. Nhấn Windows + X" $Yellow
        Write-ColorMessage "2. Chọn 'Windows Terminal (Admin)'" $Yellow
        Write-ColorMessage "3. Chạy lại script này" $Yellow
        Write-ColorMessage "`nHoặc chạy lệnh: Start-Service -Name '$($mysqlService.Name)'" $Blue
        return $false
    }
    
    try {
        Start-Service -Name $mysqlService.Name
        Start-Sleep -Seconds 3
        
        $mysqlService.Refresh()
        if ($mysqlService.Status -eq "Running") {
            Write-ColorMessage "✅ MySQL đã được khởi động thành công!" $Green
            return $true
        } else {
            Write-ColorMessage "❌ Không thể khởi động MySQL!" $Red
            return $false
        }
    } catch {
        Write-ColorMessage "❌ Lỗi khi khởi động MySQL: $($_.Exception.Message)" $Red
        return $false
    }
}

function Show-Help {
    Write-ColorMessage "`n=== MYSQL MANAGER - HAIR CUT APP ===" $Blue
    Write-ColorMessage "Cách sử dụng:" $Yellow
    Write-ColorMessage "  .\mysql-manager.ps1 check    - Kiểm tra trạng thái MySQL" $Green
    Write-ColorMessage "  .\mysql-manager.ps1 start    - Khởi động MySQL service" $Green
    Write-ColorMessage "  .\mysql-manager.ps1 help     - Hiển thị hướng dẫn" $Green
    Write-ColorMessage "`nVí dụ setup database:" $Yellow
    Write-ColorMessage "  1. .\mysql-manager.ps1 start" $Blue
    Write-ColorMessage "  2. mysql -u root -p -e 'CREATE DATABASE IF NOT EXISTS haircut;'" $Blue
    Write-ColorMessage "  3. cd hair-cut-be && npm run seed" $Blue
}

function Main {
    switch ($Action.ToLower()) {
        "check" {
            $status = Show-Status
            if ($status) {
                Write-ColorMessage "`n✅ MySQL sẵn sàng để chạy fake data!" $Green
                Write-ColorMessage "Chạy lệnh: cd hair-cut-be && npm run seed" $Blue
            } else {
                Write-ColorMessage "`n❌ MySQL chưa sẵn sàng!" $Red
                Write-ColorMessage "Chạy lệnh: .\mysql-manager.ps1 start" $Blue
            }
        }
        "start" {
            $result = Start-MySQLService
            if ($result) {
                Write-ColorMessage "`n🎉 Setup hoàn tất! Bây giờ có thể chạy fake data." $Green
                Write-ColorMessage "Các bước tiếp theo:" $Yellow
                Write-ColorMessage "1. Tạo database: mysql -u root -p -e 'CREATE DATABASE IF NOT EXISTS haircut;'" $Blue
                Write-ColorMessage "2. Chạy fake data: cd hair-cut-be && npm run seed" $Blue
            }
        }
        "help" {
            Show-Help
        }
        default {
            Write-ColorMessage "❌ Action không hợp lệ: $Action" $Red
            Show-Help
        }
    }
}

# Run main function
Main
