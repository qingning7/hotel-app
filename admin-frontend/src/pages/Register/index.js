import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/storage";
import hotelLogo from "../../hotel.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // 状态管理
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    agreement: ""
  });
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // 注意：移除了未使用的 isRegistering 状态以消除 ESLint 警告

  // 密码强度检测
  useEffect(() => {
    if (password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 检查密码强度
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    
    // 长度检查
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    
    // 字符类型检查
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    
    // 计算强度等级
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  // 清除错误信息
  const clearErrors = () => {
    setErrors({
      phone: "",
      password: "",
      confirmPassword: "",
      agreement: ""
    });
  };

  // 验证表单
  const validateForm = () => {
    clearErrors();
    let isValid = true;
    
    // 手机号码验证
    if (phone.trim() === '') {
      setErrors(prev => ({ ...prev, phone: '请输入手机号码' }));
      isValid = false;
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      setErrors(prev => ({ ...prev, phone: '请输入有效的手机号码' }));
      isValid = false;
    }
    
    // 密码验证
    if (password.trim() === '') {
      setErrors(prev => ({ ...prev, password: '请输入登录密码' }));
      isValid = false;
    } else if (password.length < 6 || password.length > 18) {
      setErrors(prev => ({ ...prev, password: '密码长度必须在6-18位之间' }));
      isValid = false;
    }
    
    // 确认密码验证
    if (confirmPassword.trim() === '') {
      setErrors(prev => ({ ...prev, confirmPassword: '请确认登录密码' }));
      isValid = false;
    } else if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '两次输入的密码不一致' }));
      isValid = false;
    }
    
    // 协议同意验证
    if (!agreement) {
      setErrors(prev => ({ ...prev, agreement: '请阅读并同意隐私协议' }));
      isValid = false;
    }
    
    return isValid;
  };

// 移除未使用的 saveUser 函数以消除 ESLint 警告
  // const saveUser = ...

  // 发送验证码
  const sendVerificationCode = () => {
    if (countdown === 0) {
      setCountdown(60);
      console.log('向手机号 ' + phone + ' 发送验证码');
    }
  };

  // 验证验证码
  const verifyCode = async () => {
    if (!verificationCode) {
      alert('请输入验证码');
      return;
    }
    
    if (verificationCode.length !== 6) {
      alert('验证码必须是6位数字');
      return;
    }
    
    if (!/^\d{6}$/.test(verificationCode)) {
      alert('验证码必须是数字');
      return;
    }
    
    // 模拟验证码验证
    if (verificationCode === '123456') {
      // 验证成功，完成注册
      try {
        await registerUser({ username: phone, password, role: userRole });
        setStep(3);
      } catch (e) {
        alert(e.message || "注册失败");
      }
    } else {
      alert('验证码错误，请重新输入');
    }
  };

  // 提交注册表单
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  // 注意：移除了未使用的 completeRegistration 函数以消除 ESLint 警告

  // 跳转到登录页面
  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 头部 */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        background: "white",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img src={hotelLogo} alt="易宿酒店" style={{ width: "50px", height: "50px" }} />
          <span style={{ color: "#667eea", fontSize: "24px", fontWeight: "bold" }}>易宿酒店</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#666", fontSize: "14px", whiteSpace: "nowrap" }}>已有易宿账号？</span>
          <button 
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.background = "#5a6fd8"}
            onMouseLeave={(e) => e.target.style.background = "#667eea"}
          >
            登录
          </button>
        </div>
      </header>
      
      {/* 步骤指示器 */}
      <div style={{
        position: "relative",
        margin: "30px 0",
        padding: "0 50px"
      }}>
        <div style={{
          position: "absolute",
          top: "25px",
          left: "50px",
          right: "50px",
          height: "2px",
          backgroundColor: "#ddd",
          zIndex: 1
        }}></div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: step >= 1 ? "#667eea" : "#fff",
              border: "2px solid",
              borderColor: step >= 1 ? "#667eea" : "#ddd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: step >= 1 ? "white" : "#666",
              marginBottom: "10px",
              transition: "all 0.3s"
            }}>
              1
            </div>
            <div style={{
              fontSize: "14px",
              color: step >= 1 ? "#667eea" : "#666",
              textAlign: "center",
              maxWidth: "120px",
              fontWeight: step >= 1 ? "bold" : "normal"
            }}>
              填写注册信息
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: step >= 2 ? "#667eea" : "#fff",
              border: "2px solid",
              borderColor: step >= 2 ? "#667eea" : "#ddd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: step >= 2 ? "white" : "#666",
              marginBottom: "10px",
              transition: "all 0.3s"
            }}>
              2
            </div>
            <div style={{
              fontSize: "14px",
              color: step >= 2 ? "#667eea" : "#666",
              textAlign: "center",
              maxWidth: "120px",
              fontWeight: step >= 2 ? "bold" : "normal"
            }}>
              接受并填写验证码
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: step >= 3 ? "#667eea" : "#fff",
              border: "2px solid",
              borderColor: step >= 3 ? "#667eea" : "#ddd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: step >= 3 ? "white" : "#666",
              marginBottom: "10px",
              transition: "all 0.3s"
            }}>
              3
            </div>
            <div style={{
              fontSize: "14px",
              color: step >= 3 ? "#667eea" : "#666",
              textAlign: "center",
              maxWidth: "120px",
              fontWeight: step >= 3 ? "bold" : "normal"
            }}>
              注册成功
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{
          padding: "40px 20px",
          borderRadius: 0,
          width: "100%",
          maxWidth: "550px",
          margin: "-200px auto 0 auto"
        }}>
          {/* 注册表单 */}
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              {/* 手机号码 */}
              <div style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "flex-start",
                gap: "15px"
              }}>
                <label style={{
                  minWidth: "100px",
                  marginBottom: 0,
                  textAlign: "right",
                  lineHeight: "44px",
                  color: "#555",
                  fontWeight: "500"
                }} htmlFor="phone">
                  <span style={{ color: "#e74c3c", marginRight: "4px" }}>*</span>
                  手机号码
                </label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                    <div style={{
                      padding: "12px",
                      backgroundColor: "#f5f5f5",
                      border: "2px solid #ddd",
                      borderRadius: "5px",
                      fontSize: "16px",
                      color: "#333",
                      minWidth: "60px"
                    }}>
                      +86
                    </div>
                    <input 
                      type="text" 
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        flex: 1,
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #ddd",
                        borderRadius: "5px",
                        fontSize: "16px",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box"
                      }}
                      required
                      placeholder="请输入手机号码"
                    />
                  </div>
                  {errors.phone && (
                    <div style={{ color: "#e74c3c", fontSize: "14px", marginTop: "5px" }}>
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* 登录密码 */}
              <div style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "flex-start",
                gap: "15px"
              }}>
                <label style={{
                  minWidth: "100px",
                  marginBottom: 0,
                  textAlign: "right",
                  lineHeight: "44px",
                  color: "#555",
                  fontWeight: "500"
                }} htmlFor="password">
                  <span style={{ color: "#e74c3c", marginRight: "4px" }}>*</span>
                  登录密码
                </label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                  {/* 核心修改：调整容器结构以匹配手机号输入框的宽度 */}
                  <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                    <input 
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "40px", // 为眼睛图标留出空间
                        border: "2px solid #ddd",
                        borderRadius: "5px",
                        fontSize: "16px",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box"
                      }}
                      required
                      placeholder="请输入登录密码"
                    />
                    <div 
                      style={{ 
                        position: "absolute", 
                        right: "10px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        padding: "5px"
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <img 
                        src={showPassword ? 
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24m0 0L9.9 4.24m0 0a4.36 4.36 0 0 0-1.72 1m4 0a4.36 4.36 0 0 1 1.72 1'%3E%3C/path%3E%3C/svg%3E" : 
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E"
                        }
                        alt={showPassword ? "隐藏密码" : "显示密码"}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "5px", whiteSpace: "nowrap", width: "100%", textAlign: "left" }}>
                    6-18位，区分大小写字母、数字、特殊符号中的两种或两种以上
                  </div>
                </div>
              </div>
              
              <div style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "flex-start",
                gap: "15px"
              }}>
                <label style={{ minWidth: "100px", marginBottom: 0, textAlign: "right", lineHeight: "44px" }}></label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px", width: "100%" }}>
                    <span style={{ fontSize: "12px", color: "#666", lineHeight: 0 }}>安全程度：</span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <div style={{
                        width: "40px",
                        height: "4px",
                        backgroundColor: passwordStrength === "weak" || passwordStrength === "medium" || passwordStrength === "strong" ? 
                          (passwordStrength === "weak" ? "#e74c3c" : passwordStrength === "medium" ? "#f39c12" : "#2ecc71") : 
                          "#ddd",
                        borderRadius: "2px"
                      }}></div>
                      <div style={{
                        width: "40px",
                        height: "4px",
                        backgroundColor: (passwordStrength === "medium" || passwordStrength === "strong") ? 
                          (passwordStrength === "medium" ? "#f39c12" : "#2ecc71") : 
                          "#ddd",
                        borderRadius: "2px"
                      }}></div>
                      <div style={{
                        width: "40px",
                        height: "4px",
                        backgroundColor: passwordStrength === "strong" ? "#2ecc71" : "#ddd",
                        borderRadius: "2px"
                      }}></div>
                    </div>
                  </div>
                  {errors.password && (
                    <div style={{ color: "#e74c3c", fontSize: "14px", marginTop: "5px" }}>
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              {/* 确认密码 */}
              <div style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "flex-start",
                gap: "15px"
              }}>
                <label style={{
                  minWidth: "100px",
                  marginBottom: 0,
                  textAlign: "right",
                  lineHeight: "44px",
                  color: "#555",
                  fontWeight: "500"
                }} htmlFor="confirmPassword">
                  <span style={{ color: "#e74c3c", marginRight: "4px" }}>*</span>
                  确认密码
                </label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                  {/* 核心修改：与登录密码保持一致的结构 */}
                  <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "40px", // 为眼睛图标留出空间
                        border: "2px solid #ddd",
                        borderRadius: "5px",
                        fontSize: "16px",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box"
                      }}
                      required
                      placeholder="请确认登录密码"
                    />
                    <div 
                      style={{ 
                        position: "absolute", 
                        right: "10px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        padding: "5px"
                      }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <img 
                        src={showConfirmPassword ? 
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24m0 0L9.9 4.24m0 0a4.36 4.36 0 0 0-1.72 1m4 0a4.36 4.36 0 0 1 1.72 1'%3E%3C/path%3E%3C/svg%3E" : 
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E"
                        }
                        alt={showConfirmPassword ? "隐藏密码" : "显示密码"}
                      />
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <div style={{ color: "#e74c3c", fontSize: "14px", marginTop: "5px" }}>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>

              {/* 协议同意 */}
              <div style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "flex-start",
                gap: "15px"
              }}>
                <label style={{ minWidth: "100px", marginBottom: 0, textAlign: "right", lineHeight: "44px" }}></label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", paddingLeft: 0 }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#666",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    maxWidth: "100%"
                  }}>
                    <input 
                      type="checkbox" 
                      id="agreement"
                      checked={agreement}
                      onChange={(e) => setAgreement(e.target.checked)}
                      style={{ marginTop: "3px", cursor: "pointer" }}
                      required
                    />
                    <span style={{ whiteSpace: "nowrap" }}>我已阅读并同意</span>
                    {/* 核心修改：将 <a> 标签改为 <button> 并添加样式，以消除 jsx-a11y/anchor-is-valid 警告 */}
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); alert('这里展示隐私协议'); }}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#667eea', 
                        textDecoration: 'none', 
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: 'inherit'
                      }}
                    >
                      《隐私协议和服务条款》
                    </button>
                  </label>
                  {errors.agreement && (
                    <div style={{ color: "#e74c3c", fontSize: "14px", marginTop: "5px" }}>
                      {errors.agreement}
                    </div>
                  )}
                </div>
              </div>

              {/* 注册按钮 */}
              <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                <button 
                  type="submit"
                  style={{
                    padding: "14px 30px",
                    background: "linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  onMouseDown={(e) => e.target.style.transform = "translateY(0)"}
                >
                  同意服务条款并注册
                </button>
              </div>
            </form>
          )}
          
          {/* 验证码部分 */}
          {step === 2 && (
            <div>
              <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px", fontSize: "24px" }}>
                验证手机号码
              </h2>
              <div style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "flex-start",
                gap: "15px"
              }}>
                <label style={{
                  minWidth: "100px",
                  marginBottom: 0,
                  textAlign: "right",
                  lineHeight: "44px",
                  color: "#555",
                  fontWeight: "500"
                }} htmlFor="verificationCode">
                  <span style={{ color: "#e74c3c", marginRight: "4px" }}>*</span>
                  验证码
                </label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <input 
                      type="text" 
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: "200px",
                        padding: "12px",
                        border: "2px solid #ddd",
                        borderRadius: "5px",
                        fontSize: "16px",
                        transition: "border-color 0.3s"
                      }}
                      placeholder="请输入6位验证码"
                      maxLength={6}
                    />
                    <button 
                      type="button"
                      onClick={sendVerificationCode}
                      style={{
                        padding: "12px 20px",
                        background: countdown > 0 ? "#ccc" : "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "14px",
                        cursor: countdown > 0 ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        transition: "background-color 0.3s"
                      }}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}秒后重新发送` : "发送验证码"}
                    </button>
                  </div>
                  {countdown > 0 && (
                    <div style={{ color: "#999", fontSize: "14px", whiteSpace: "nowrap", marginTop: "5px" }}>
                      {countdown}秒后可重新发送
                    </div>
                  )}
                  {/* 角色选择单选按钮 */}
                  <div style={{ marginTop: "15px" }}>
                    <label style={{ display: "inline-flex", alignItems: "center", marginRight: "20px" }}>
                      <input 
                        type="radio" 
                        id="isAdmin" 
                        name="userRole" 
                        value="admin"
                        checked={userRole === "admin"}
                        onChange={(e) => setUserRole(e.target.value)}
                        style={{ marginRight: "5px" }}
                      />
                      我是管理员
                    </label>
                    <label style={{ display: "inline-flex", alignItems: "center" }}>
                      <input 
                        type="radio" 
                        id="isMerchant" 
                        name="userRole" 
                        value="merchant"
                        checked={userRole === "merchant"}
                        onChange={(e) => setUserRole(e.target.value)}
                        style={{ marginRight: "5px" }}
                      />
                      我是商家
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", marginTop: "30px", color: "#666", marginLeft: "115px" }}>
                <button 
                  type="button"
                  onClick={verifyCode}
                  style={{
                    padding: "14px 30px",
                    background: "linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  onMouseDown={(e) => e.target.style.transform = "translateY(0)"}
                >
                  验证并完成注册
                </button>
              </div>
            </div>
          )}
          
          {/* 注册成功 */}
          {step === 3 && (
            <div style={{
              textAlign: "center",
              margin: "50px 0",
              fontSize: "24px",
              color: "black",
              fontWeight: "bold"
            }}>
              注册成功！请点击右上角登录。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}