import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
type Lang = 'en' | 'vi';

interface ThemeLangContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const ThemeLangContext = createContext<ThemeLangContextType | undefined>(undefined);

const viDict: Record<string, string> = {
  // Navigation
  'Dashboard': 'Bảng điều khiển',
  'Customers': 'Khách hàng',
  'Receivables': 'Khoản nợ',
  'Rules': 'Luật nhắc nợ',
  'Templates': 'Mẫu Email',
  'Logout': 'Đăng xuất',
  'Overview': 'Tổng quan',

  // Dashboard
  'Welcome back, Admin!': 'Chào mừng trở lại, Quản trị viên!',
  'Upcoming Dues': 'Sắp đến hạn',
  'Total count': 'Tổng số lượng',
  'Overdue': 'Quá hạn',
  'Requires attention': 'Cần chú ý',
  'Emails Sent': 'Email đã gửi',
  'Automated today': 'Tự động gửi hôm nay',
  'Recent Debt Activities': 'Hoạt động Nhắc nợ Gần đây',
  'Debtor Name': 'Tên khách nợ',
  'Amount': 'Số tiền',
  'Due Date': 'Ngày hạn chót',
  'Payment Status': 'Trạng thái',
  'Actions': 'Thao tác',
  'No recent activities': 'Không có hoạt động gần đây',
  'today': 'hôm nay',

  // Common Table
  'Status': 'Trạng thái',
  'Search coming soon!': 'Tính năng tìm kiếm sắp ra mắt!',
  'No new notifications': 'Không có thông báo mới',
  'Help center coming soon!': 'Trung tâm trợ giúp sắp ra mắt!',
  'Profile settings coming soon!': 'Cài đặt hồ sơ sắp ra mắt!',
  
  // Customers
  'Add Customer': 'Thêm Khách hàng',
  'Edit Customer': 'Sửa Khách hàng',
  'Name': 'Họ và tên',
  'Email': 'Email',
  'Phone': 'Số điện thoại',
  'Company': 'Công ty',
  'Timezone': 'Múi giờ',
  'Cancel': 'Hủy',
  'Saving...': 'Đang lưu...',
  'Save Customer': 'Lưu Khách hàng',
  'No customers found.': 'Không tìm thấy khách hàng nào.',

  // Receivables
  'Add Receivable': 'Thêm Khoản nợ',
  'Edit Receivable': 'Sửa Khoản nợ',
  'Customer': 'Khách hàng',
  'Currency': 'Tiền tệ',
  'Title / Description': 'Tiêu đề / Mô tả',
  'Save Receivable': 'Lưu Khoản nợ',
  'No receivables found.': 'Không tìm thấy khoản nợ nào.',
  'Auto-Reminders (Assigned Rules)': 'Luật nhắc tự động',
  'No rules available to assign.': 'Không có luật nào để gán.',

  // Rules
  'Add Rule': 'Thêm Luật',
  'Edit Rule': 'Sửa Luật',
  'Reminder Rules': 'Luật Nhắc Nợ',
  'Trigger Days': 'Ngày Kích Hoạt',
  'Action': 'Hành động',
  'Rule Name': 'Tên Luật',
  'Trigger Type': 'Loại Kích hoạt',
  'Before Due': 'Trước hạn',
  'On Due': 'Đúng hạn',
  'After Due': 'Sau hạn',
  'Offset Days': 'Số ngày cách biệt',
  'Repeat Every (Days) - Optional': 'Lặp lại mỗi (Ngày) - Tùy chọn',
  'Chu kỳ lặp lại (Repeat Interval)': 'Chu kỳ lặp lại (Repeat Interval)',
  'Chỉ một lần (Once)': 'Chỉ một lần (Once)',
  'Mỗi 1 ngày': 'Mỗi 1 ngày',
  'Mỗi 2 ngày': 'Mỗi 2 ngày',
  'Mỗi tuần': 'Mỗi tuần',
  'Mỗi tháng': 'Mỗi tháng',
  'Mỗi năm': 'Mỗi năm',
  'Tùy chỉnh số ngày...': 'Tùy chỉnh số ngày...',
  'Nhập số ngày cụ thể (e.g., 14)': 'Nhập số ngày cụ thể (VD: 14)',
  'Template': 'Mẫu Email',
  'Select an email template': 'Chọn một mẫu email',
  'Save Rule': 'Lưu Luật',
  'No rules configured.': 'Chưa cấu hình luật nào.',
  'days before_due': 'ngày trước hạn',
  'days after_due': 'ngày sau hạn',
  'days on_due': 'ngày đúng hạn',
  'Repeats every': 'Lặp lại mỗi',
  'days': 'ngày',

  // Templates
  'Add Template': 'Thêm Mẫu',
  'Edit Template': 'Sửa Mẫu',
  'Email Templates': 'Mẫu Email',
  'Subject': 'Tiêu đề Email',
  'HTML Body': 'Nội dung (HTML)',
  'Save Template': 'Lưu Mẫu Email',
  'No templates configured.': 'Chưa có mẫu email nào.',

  // Badges
  'paid': 'đã trả',
  'overdue': 'quá hạn',
  'pending': 'đang chờ',
  'active': 'hoạt động',
  'inactive': 'ngừng hđ',
  'cancelled': 'đã hủy'
};

export const ThemeLangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = (key: string): string => {
    if (lang === 'vi' && viDict[key]) {
      return viDict[key];
    }
    return key;
  };

  return (
    <ThemeLangContext.Provider value={{ theme, toggleTheme, lang, setLang, t }}>
      {children}
    </ThemeLangContext.Provider>
  );
};

export const useThemeLang = () => {
  const context = useContext(ThemeLangContext);
  if (!context) throw new Error("useThemeLang must be used within ThemeLangProvider");
  return context;
};
