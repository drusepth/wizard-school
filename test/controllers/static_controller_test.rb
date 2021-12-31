require "test_helper"

class StaticControllerTest < ActionDispatch::IntegrationTest
  test "should get sandbox" do
    get static_sandbox_url
    assert_response :success
  end
end
