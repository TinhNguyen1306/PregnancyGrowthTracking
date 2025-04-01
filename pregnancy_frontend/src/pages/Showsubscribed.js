import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Showsubscribed = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Khởi tạo navigate

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            setError(null);  // Reset lỗi mỗi khi bắt đầu tải dữ liệu
            try {
                const token = localStorage.getItem('userToken');
                console.log('Token:', token);  // Thêm dòng này để kiểm tra giá trị token
                if (!token) {
                    setError('Bạn cần đăng nhập để xem thông tin.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5001/api/payments/show', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPayments(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải dữ liệu thanh toán');
                setLoading(false);
                console.error('Error fetching payments:', err);
            }
        };

        fetchPayments();
    }, []);

    const handleBackToDashboard = () => {
        navigate('/dashboard'); // Điều hướng về trang Dashboard
    };

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{
            background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
        }}
        >
            <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>Lịch sử thanh toán của bạn</h2>

                {payments.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        color: '#d9534f'
                    }}>Không có thanh toán nào.</p>
                ) : (
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#f1f1f1',
                                color: '#333',
                                fontWeight: 'bold',
                            }}>
                                <th style={{
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    textAlign: 'left',
                                }}>Plan</th>
                                <th style={{
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    textAlign: 'left',
                                }}>Giá</th>
                                <th style={{
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    textAlign: 'left',
                                }}>Phương thức thanh toán</th>
                                <th style={{
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    textAlign: 'left',
                                }}>Trạng thái</th>
                                <th style={{
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    textAlign: 'left',
                                }}>Ngày thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.paymentId} style={{
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#fafafa',
                                }}>
                                    <td style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        textAlign: 'left',
                                    }}>{payment.planName}</td>
                                    <td style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        textAlign: 'left',
                                    }}>{payment.planPrice}</td>
                                    <td style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        textAlign: 'left',
                                    }}>{payment.paymentMethod}</td>
                                    <td style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        textAlign: 'left',
                                    }}>{payment.paymentStatus}</td>
                                    <td style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        textAlign: 'left',
                                    }}>
                                        {new Date(payment.paymentDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{
                    marginTop: '20px',
                    textAlign: 'center',
                }}>
                    <button
                        onClick={handleBackToDashboard}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Showsubscribed;
