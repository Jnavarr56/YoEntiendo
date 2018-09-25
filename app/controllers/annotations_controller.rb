class AnnotationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_annotation, only: [:show, :edit, :update, :destroy]

  # GET /annotations
  # GET /annotations.json
  def index
    @annotations_by_user = Annotation.where(made_by: current_user.id)
    @annotations_by_collaborators = []
    @related_passages = {}

    @user_passages = Passage.where(user_id: current_user.id)

    if @user_passages != nil
      @user_passages.each do |passage|
        annotations = Annotation.where(passage_id: passage.id)
        if annotations != nil
          annotations.each do |annotation|
            @annotations_by_collaborators.push(annotation)
            @related_passages[annotation.id] = Passage.find(annotation.passage_id)
          end
        end
      end
    end



    if @annotations_by_user == nil
      @annotations_by_user = []    
    end

    @annotation_authors = {}
    @annotations = @annotations_by_user + @annotations_by_collaborators

    @annotations.each do |annotation|
      @annotation_authors[annotation.id] = User.find(annotation.made_by)
    end

    @annotations.each do |annotation|
      puts annotation.inspect
      puts @annotation_authors[annotation.made_by].inspect
      puts @related_passages[annotation.id].inspect
    end


    @current_user = current_user
  end

  # GET /annotations/1
  # GET /annotations/1.json
  def show
    @current_user = current_user
    @passage = Passage.find(@annotation.passage_id)

    if (@passage.user_id == @current_user.id) || (@annotation.made_by == @current_user.id)
    else
      redirect_back fallback_location: '/'
    end
  end

  # GET /annotations/new
  def new
    @annotation = Annotation.new
  end

  # GET /annotations/1/edit
  def edit
    @isCreation = false
    @current_user = current_user
    @passage = Passage.find(@annotation.passage_id)

    if (@passage.user_id == @current_user.id) || (@annotation.made_by == @current_user.id)
    else
      redirect_back fallback_location: '/'
    end
    
  end

  # POST /annotations
  # POST /annotations.json
  def create
    @isCreation = true
    
    @annotation = Annotation.new(annotation_params)

    respond_to do |format|
      if @annotation.save
        format.html { redirect_to @annotation, notice: 'Annotation was successfully created.' }
        format.json { render :show, status: :created, location: @annotation }
      else
        format.html { render :new }
        format.json { render json: @annotation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /annotations/1
  # PATCH/PUT /annotations/1.json
  def update
    respond_to do |format|
      if @annotation.update(annotation_params)
        format.html { redirect_to @annotation, notice: 'Annotation was successfully updated.' }
        format.json { render :show, status: :ok, location: @annotation }
      else
        format.html { render :edit }
        format.json { render json: @annotation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /annotations/1
  # DELETE /annotations/1.json
  def destroy
    @annotation.destroy
    respond_to do |format|
      format.html { redirect_to annotations_url, notice: 'Annotation was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_annotation
      @annotation = Annotation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def annotation_params
      params.require(:annotation).permit(:passage_id, :original_spanish, :annotation_content)
    end
end
