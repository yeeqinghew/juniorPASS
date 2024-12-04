import { Divider, Flex, Space, Image, Typography, Layout } from "antd";
import { Link } from "react-router-dom";
import {
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  LinkedinFilled,
  InstagramOutlined,
} from "@ant-design/icons";
import React from "react";

const { Text, Title } = Typography;
const { Footer: Foot } = Layout;

const Footer = () => {
  return (
    <Foot style={{ background: "#FCFBF8", padding: "20px 150px" }}>
      <Divider></Divider>
      <Flex style={{ width: "100%" }}>
        <Flex style={{ width: "25%", justifyContent: "flex-start" }}>
          <Flex vertical gap="large">
            <Link to="/">
              <Image
                alt="logo"
                src={require("../images/logopngResize.png")}
                width={100}
                height={50}
                preview={false}
              />
            </Link>
          </Flex>
        </Flex>

        <Flex style={{ right: 0, width: "90%", justifyContent: "flex-end" }}>
          <Flex vertical gap="large" style={{ width: "20%" }}>
            <Title level={5}>JuniorPass</Title>
            <Link to="/about-us">About us</Link>
            <Link to="/classes">Classes</Link>
            <Link to="/pricing">Pricing</Link>
          </Flex>

          <Flex vertical gap="large" style={{ width: "20%" }}>
            <Title level={5}>SUPPORT</Title>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/faq">FAQs</Link>
          </Flex>

          <Flex vertical gap="large" style={{ width: "20%" }}>
            <Title level={5}>PARTNERS</Title>
            <Link to="/partner-contact">Become a partner</Link>
            <Link to="/partner/login">Partner Login</Link>
            {/* <Link to="/contactus">ContactUs</Link> */}
          </Flex>

          <Flex vertical gap="large" style={{ width: "20%" }}>
            <Title level={5}>FOLLOW US</Title>
            <Space direction="horizontal">
              <MailOutlined />
              <Link to="mailto:admin@juniorpass.sg">admin@juniorpass.sg</Link>
            </Space>
            <Flex vertical={false} gap="large" style={{ width: "15%" }}>
              <Space direction="horizontal">
                <FacebookFilled />
              </Space>

              <Space direction="horizontal">
                <Link to="https://www.instagram.com/juniorpass.sg/">
                  <InstagramOutlined />
                </Link>
              </Space>

              <Space direction="horizontal">
                <LinkedinFilled />
              </Space>
            </Flex>
            <Space direction="horizontal">
              <PhoneOutlined />
              <Text>(65)XXXX-XXXX</Text>
            </Space>

            {/* <Space direction="horizontal">
        <WhatsAppOutlined />
        <Text>(65)XXXX-XXXX</Text>
      </Space> */}
          </Flex>
        </Flex>
      </Flex>
      <Divider></Divider>© Copyright {new Date().getFullYear()} juniorPASS (UEN:
      202411484C)
    </Foot>
  );
};

export default Footer;
