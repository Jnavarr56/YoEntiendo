require 'test_helper'

class AnnotationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @annotation = annotations(:one)
  end

  test "should get index" do
    get annotations_url
    assert_response :success
  end

  test "should get new" do
    get new_annotation_url
    assert_response :success
  end

  test "should create annotation" do
    assert_difference('Annotation.count') do
      post annotations_url, params: { annotation: { annotation_content: @annotation.annotation_content, original_spanish: @annotation.original_spanish, passage_id: @annotation.passage_id } }
    end

    assert_redirected_to annotation_url(Annotation.last)
  end

  test "should show annotation" do
    get annotation_url(@annotation)
    assert_response :success
  end

  test "should get edit" do
    get edit_annotation_url(@annotation)
    assert_response :success
  end

  test "should update annotation" do
    patch annotation_url(@annotation), params: { annotation: { annotation_content: @annotation.annotation_content, original_spanish: @annotation.original_spanish, passage_id: @annotation.passage_id } }
    assert_redirected_to annotation_url(@annotation)
  end

  test "should destroy annotation" do
    assert_difference('Annotation.count', -1) do
      delete annotation_url(@annotation)
    end

    assert_redirected_to annotations_url
  end
end
