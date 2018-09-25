require 'test_helper'

class PassagesharesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @passageshare = passageshares(:one)
  end

  test "should get index" do
    get passageshares_url
    assert_response :success
  end

  test "should get new" do
    get new_passageshare_url
    assert_response :success
  end

  test "should create passageshare" do
    assert_difference('Passageshare.count') do
      post passageshares_url, params: { passageshare: { author_user_id: @passageshare.author_user_id, edit_privilege: @passageshare.edit_privilege, passage_id: @passageshare.passage_id, recieving_user_id: @passageshare.recieving_user_id } }
    end

    assert_redirected_to passageshare_url(Passageshare.last)
  end

  test "should show passageshare" do
    get passageshare_url(@passageshare)
    assert_response :success
  end

  test "should get edit" do
    get edit_passageshare_url(@passageshare)
    assert_response :success
  end

  test "should update passageshare" do
    patch passageshare_url(@passageshare), params: { passageshare: { author_user_id: @passageshare.author_user_id, edit_privilege: @passageshare.edit_privilege, passage_id: @passageshare.passage_id, recieving_user_id: @passageshare.recieving_user_id } }
    assert_redirected_to passageshare_url(@passageshare)
  end

  test "should destroy passageshare" do
    assert_difference('Passageshare.count', -1) do
      delete passageshare_url(@passageshare)
    end

    assert_redirected_to passageshares_url
  end
end
