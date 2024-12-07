const About = () => {
  return (
    <div className="about-container">
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center">
                <h2 className="display-5 fw-bold">SGU Bus Lines</h2>
                <h4>Chất lượng là danh dự</h4>
                <p className="lead">
                  Hệ thống bán vé xe buýt trực tuyến cung cấp giải pháp tiện lợi, nhanh chóng, giúp hành khách dễ dàng tra cứu lộ trình, chọn chỗ ngồi và thanh toán an toàn mọi lúc, mọi nơi.
                </p>
              </div>
            </div>
          </div>
          <div className="row mt-5 gx-4 align-items-center justify-content-between">
            <div className="col-md-5 order-2 order-md-1">
              <div className="mt-5 mt-md-0">
                <h2 className="display-5 fw-bold text-center">
                  Giá Trị Cốt Lõi
                </h2>
                <p className="lead">

                  Giá trị cốt lõi của chúng tôi là cam kết mang đến sự tin cậy, chất lượng và trải nghiệm vượt trội, không ngừng đổi mới để đáp ứng nhu cầu của khách hàng, đồng thời xây dựng mối quan hệ bền vững dựa trên sự tôn trọng, trách nhiệm và tận tâm trong từng dịch vụ cung cấp.
                </p>

              </div>
            </div>
            <div className="col-md-6 offset-md-1 order-1 order-md-2">
              <div className="row gx-2 gx-lg-3">
                <div className="">
                  <div className="mb-2">
                    <img
                      className="img-fluid rounded-3"
                      src="https://cdn.futabus.vn/futa-busline-web-cms-prod/Artboard_4_3x_44277bbc3b/Artboard_4_3x_44277bbc3b.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5 gx-4 align-items-center justify-content-between">
            <div className="col-md-6">
              <div className="row gx-2 gx-lg-3">
                <div className="">
                  <div className="mb-2">
                    <img
                      className="img-fluid rounded-3"
                      src="https://cdn.futabus.vn/futa-busline-web-cms-prod/Artboard_3_3x_fb31ff2c98/Artboard_3_3x_fb31ff2c98.png"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 order-2 order-md-1">
              <div className="mt-5 mt-md-0">
                <h2 className="display-5 fw-bold text-center">
                  Tầm Nhìn Và Sứ Mệnh
                </h2>
                <p className="lead">
                  Tầm nhìn của chúng tôi là trở thành đơn vị tiên phong trong lĩnh vực vận tải, mang lại những giải pháp thông minh và bền vững; sứ mệnh của chúng tôi là kết nối con người, tạo nên những hành trình an toàn, tiện lợi và thân thiện với môi trường, góp phần xây dựng cộng đồng văn minh và phát triển
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
