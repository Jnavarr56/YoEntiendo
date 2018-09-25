require 'test_helper'

class DocumentpassagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @documentpassage = documentpassages(:one)
  end

  test "should get index" do
    get documentpassages_url
    assert_response :success
  end

  test "should get new" do
    get new_documentpassage_url
    assert_response :success
  end

  test "should create documentpassage" do
    assert_difference('Documentpassage.count') do
      post documentpassages_url, params: { documentpassage: { document_id: @documentpassage.document_id, passage_id: @documentpassage.passage_id } }
    end

    assert_redirected_to documentpassage_url(Documentpassage.last)
  end

  test "should show documentpassage" do
    get documentpassage_url(@documentpassage)
    assert_response :success
  end

  test "should get edit" do
    get edit_documentpassage_url(@documentpassage)
    assert_response :success
  end

  test "should update documentpassage" do
    patch documentpassage_url(@documentpassage), params: { documentpassage: { document_id: @documentpassage.document_id, passage_id: @documentpassage.passage_id } }
    assert_redirected_to documentpassage_url(@documentpassage)
  end

  test "should destroy documentpassage" do
    assert_difference('Documentpassage.count', -1) do
      delete documentpassage_url(@documentpassage)
    end

    assert_redirected_to documentpassages_url
  end
end
