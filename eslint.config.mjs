// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist'], // Bỏ qua cả thư mục build
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      // Vì bạn dùng NestJS với nodenext/commonjs, nên để module
      sourceType: 'module', 
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      /* --- QUY TẮC VỀ ANY (ĐÚNG Ý BẠN) --- */
      '@typescript-eslint/no-explicit-any': 'error', // BÁO LỖI nếu dùng any (ép dùng unknown hoặc interface)
      
      /* --- QUY TẮC GIÚP CODE THOÁNG HƠN --- */
      '@typescript-eslint/no-floating-promises': 'warn', // Chỉ cảnh báo khi quên 'await'
      '@typescript-eslint/no-unsafe-argument': 'off',    // TẮT: Cho phép truyền đối số linh hoạt hơn (giảm lỗi Unsafe bạn gặp lúc nãy)
      '@typescript-eslint/no-unsafe-assignment': 'off',  // TẮT: Cho phép gán giá trị thoải mái hơn
      '@typescript-eslint/no-unsafe-member-access': 'off', // TẮT: Để dễ dàng truy cập thuộc tính từ biến unknown sau khi ép kiểu
      '@typescript-eslint/no-unsafe-call': 'off',        // TẮT: Tránh bắt lỗi khi gọi hàm từ thư viện bên ngoài
      
      /* --- PRETTIER --- */
      "prettier/prettier": ["error", { endOfLine:  ' auto',
          singleQuote: true,
          trailingComma: 'all', }],
      
      /* --- NHẮC NHỞ CODE SẠCH --- */
      'no-unused-vars': 'off', // Tắt của JS gốc
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Cảnh báo biến thừa nhưng cho phép nếu bắt đầu bằng dấu _
    },
  },
);